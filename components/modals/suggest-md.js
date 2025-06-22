const { Client, ChatInputCommandInteraction, EmbedBuilder, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
module.exports = {
  type: 'modals',
  data: { name: 'suggest-md' },
  /** - Suggest Modal
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const { errorEmbed, catchError } = client;
    const description = interaction.fields.getTextInputValue('content');

    try {
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);

      if (!profile || !profile?.setup?.suggest)
        return await interaction.reply(
          errorEmbed({
            desc: `This server hasn't been setup Suggest Channel. Please contact the ${cfg.adminRole}'s team`,
            emoji: false,
          }),
        );

      const sgtChannel = client.channels.cache.get(profile?.setup?.suggest);

      const embed = new EmbedBuilder()
        .setAuthor({ name: `${user.tag}'s suggestions`, iconURL: user.displayAvatarURL(true) })
        .setTitle("Suggest's content:")
        .setDescription(description)
        .setColor(Colors.Yellow)
        .setThumbnail(cfg.suggestPNG)
        .setTimestamp()
        .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
        .addFields({ name: '\u200b', value: '❗ Đề xuất sẽ được xem xét và trả lời sớm nhất!' });

      const msg = await sgtChannel.send({ embeds: [embed] });

      await interaction
        .reply(
          errorEmbed({ desc: `Your suggestion has been sent successfully! [[Jump link](${msg.url})]`, emoji: true }),
        )
        .then(() => ['👍', '👎'].forEach(async (e) => await msg.react(e)));
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
