const {
  Client,
  Interaction,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new ContextMenuCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('Deny Suggestion')
    .setType(ApplicationCommandType.Message),
  /** - Denies a suggestion.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { targetMessage: msg, user, guild } = interaction;
    const { errorEmbed, catchError, users, user: bot } = client;

    if (msg.author.id !== cfg.clientID)
      return await interaction.reply(errorEmbed({ desc: `This message does not belong to ${bot}!` }));

    const embed = msg.embeds[0];

    if (!embed) return await interaction.reply(errorEmbed({ desc: 'This is not a suggestion message!' }));

    if (embed.title !== "Suggest's content:")
      return await interaction.reply(errorEmbed({ desc: 'This is not a suggestion message!' }));

    const edit = EmbedBuilder.from(embed).setColor(Colors.DarkVividPink).spliceFields(0, 1).setTimestamp().setFooter({
      text: 'Suggestion denied',
      iconURL: 'https://cdn3.emoji.gg/emojis/5601-x-mark.gif',
    });

    await msg.edit({ embeds: [edit] });

    await interaction.reply(
      errorEmbed({
        desc: `Suggestion has been denied! [[Jump Link](${msg.url})]`,
        emoji: '\\🚫',
        color: Colors.DarkVividPink,
      })
    );

    const author = users.cache.find((u) => u.tag === embed.author.name.split(`'s`)[0]);

    if (!author) return await interaction.followUp(errorEmbed({ desc: 'Could not find user to send DM!' }));

    await author
      .send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: 'Deny suggestion', iconURL: 'https://cdn3.emoji.gg/emojis/5601-x-mark.gif' })
            .setTitle(`Your suggestion has been denied by ${user.displayName || user.username}!`)
            .setDescription(`[Jump Link](${msg.url})`)
            .setColor(Colors.DarkVividPink)
            .setThumbnail(user.defaultAvatarURL(true))
            .setTimestamp()
            .setFooter({ text: guild.name, iconURL: guild.iconURL(true) }),
        ],
      })
      .catch((e) => {
        return catchError(interaction, e, this);
      });
  },
};
