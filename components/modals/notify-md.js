const { Client, ChatInputCommandInteraction, EmbedBuilder, Colors } = require('discord.js');
const { checkURL } = require('../../functions/common/utilities');

module.exports = {
  type: 'modals',
  data: { name: 'notify-md' },
  /** - Notify Modal
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;
    const { catchError } = client;
    const [notifytype, title, description, imageURL, thumbnail] = [
      fields.getTextInputValue('type'),
      fields.getTextInputValue('title'),
      fields.getTextInputValue('description'),
      fields.getTextInputValue('imageURL'),
      [cfg.thongbaoPNG, cfg.updatePNG],
    ];

    try {
      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle(title)
        .setDescription(description)
        .setColor(Colors.DarkVividPink)
        .setThumbnail(thumbnail[notifytype - 1])
        .setImage(checkURL(imageURL) ? imageURL : null)
        .setTimestamp()
        .setFooter({ text: 'Sent by ' + (user.displayName || user.username), iconURL: user.displayAvatarURL(true) });

      return await interaction.reply({ embeds: [embed] });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
