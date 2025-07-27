const { Client, Interaction, EmbedBuilder, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { linkButton } = require('../../functions/common/components');

module.exports = {
  type: 'modals',
  data: { name: 'suggest' },
  /** - Suggestion Modal
   * @param {Interaction} interaction - The modal submit interaction
   * @param {Client} client - The Discord client */
  async execute(interaction, client) {
    const { guild, guildId, user, fields } = interaction;
    const { messageEmbed } = client;
    const description = fields.getTextInputValue('content');

    const profile = await serverProfile.findOne({ guildId }).catch(console.error);

    const { suggest } = profile || {};
    if (!profile || !suggest?.channelId)
      return await interaction.reply(
        messageEmbed({
          desc: `This server has not set up a suggestion channel. Please contact the ${cfg.adminRole} team for assistance.`,
        })
      );

    const suggestChannel = guild.channels.cache.get(suggest?.channelId);
    if (!suggestChannel)
      return await interaction.reply(client.messageEmbed({ desc: 'Suggestion channel not found or invalid.' }));

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGold)
        .setThumbnail(cfg.suggest_gif)
        .setAuthor({
          name: `Suggestion from ${user.displayName || user.username}`,
          iconURL: user.displayAvatarURL(true),
        })
        .setTitle('Suggestion Content:')
        .setDescription(description)
        .setFooter({ text: `${guild.name} Suggestion`, iconURL: guild.iconURL(true) })
        .setTimestamp()
        .setFields({
          name: '\u200b',
          value: '❗ The suggestion will be considered and responded to as soon as possible!',
        }),
    ];

    const msg = await suggestChannel.send({ embeds });

    await interaction.reply({
      ...messageEmbed({ desc: 'Your suggestion has been sent successfully!', emoji: true }),
      components: [linkButton(msg.url)],
    });
    await Promise.all(['👍', '👎'].map((emoji) => msg.react(emoji)));
  },
};
