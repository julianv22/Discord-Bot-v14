const { EmbedBuilder, Client, Interaction } = require('discord.js');
const { checkURL } = require('../../functions/common/utilities');
module.exports = {
  data: { name: 'notify-md' },
  /**
   * Notify Modal
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;
    const notifytype = fields.getTextInputValue('type');
    const title = fields.getTextInputValue('title');
    const description = fields.getTextInputValue('description');
    const imageURL = fields.getTextInputValue('imageURL');

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(title)
      .setDescription(description)
      .setColor('Red')
      .setThumbnail(cfg.thongbaoPNG)
      .setFooter({
        text: 'Sent by ' + (user.displayName || user.username),
        iconURL: user.displayAvatarURL(true),
      })
      .setTimestamp()
      .setThumbnail(notifytype === '2' ? cfg.updatePNG : cfg.thongbaoPNG)
      .setImage(checkURL(imageURL) ? imageURL : null);

    await interaction.reply({ embeds: [embed] });
  },
};
