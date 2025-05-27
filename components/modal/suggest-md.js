const serverProfile = require('../../config/serverProfile');
const { EmbedBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: { name: 'suggest-md' },
  /**
   * Suggest Modal
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user } = interaction;
    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(() => {});
    if (!profile || !profile?.suggestChannel)
      return await interaction.reply(
        errorEmbed(true, `This server hasn't been setup Suggest Channel. Please contact the ${cfg.adminRole}'s team`),
      );

    const sgtChannel = client.channels.cache.get(profile?.suggestChannel);
    const content = interaction.fields.getTextInputValue('content');
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${user.tag}'s suggestions`,
        iconURL: user.displayAvatarURL(true),
      })
      .setTitle(`Suggest's content:`)
      .setDescription(content)
      .setColor('Yellow')
      .addFields({
        name: '\u200b',
        value: `\`❗ Đề xuất sẽ được xem xét và trả lời sớm nhất!\``,
      })
      .setThumbnail(cfg.suggestPNG)
      .setTimestamp()
      .setFooter({ text: guild.name, iconURL: guild.iconURL(true) });

    const msg = await sgtChannel.send({ embeds: [embed] });

    await interaction
      .reply(errorEmbed(false, `Your suggestion has been sent successfully! [[Jump link](${msg.url})]`))
      .then(() => {
        msg.react('👍');
        msg.react('👎');
      });
  },
};
