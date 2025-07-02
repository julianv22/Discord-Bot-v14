const { Client, ChatInputCommandInteraction, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  type: 'modals',
  data: { name: 'notify-md' },
  /** - Notify Modal
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;
    const notifytype = fields.getTextInputValue('type');
    const title = fields.getTextInputValue('title');
    const description = fields.getTextInputValue('description');
    const imageURL = fields.getTextInputValue('imageURL');
    const thumbnail = [cfg.thongbaoPNG, cfg.updatePNG];

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(title.length > 256 ? title.slice(0, 256) : title)
      .setDescription(description.length > 4096 ? description.slice(0, 4096) : description)
      .setColor(Colors.DarkVividPink)
      .setThumbnail(thumbnail[notifytype - 1])
      .setImage(imageURL.checkURL() ? imageURL : null)
      .setTimestamp()
      .setFooter({ text: 'Sent by ' + (user.displayName || user.username), iconURL: user.displayAvatarURL(true) });

    return await interaction.reply({ embeds: [embed] });
  },
};
