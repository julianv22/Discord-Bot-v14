const { Client, Interaction, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  type: 'modals',
  data: { name: 'notify' },
  /** - Notify Modal
   * @param {Interaction} interaction Modal Message Modal Submit Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;
    const notifytype = fields.getTextInputValue('type');
    const title = fields.getTextInputValue('title');
    const description = fields.getTextInputValue('description');
    const imageURL = fields.getTextInputValue('imageURL');
    const thumbnailOptions = [cfg.thongbaoPNG, cfg.updatePNG];

    const truncateString = (str, maxLength) => (str.length > maxLength ? str.slice(0, maxLength) : str);

    // Kiểm tra notifytype có hợp lệ không
    const selectedThumbnail = thumbnailOptions[notifytype - 1];
    if (!thumbnailOptions.includes(selectedThumbnail))
      return await interaction.reply(
        client.errorEmbed({ desc: 'Loại thông báo không hợp lệ. Vui lòng chọn 1 hoặc 2.' })
      );

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkVividPink)
        .setThumbnail(selectedThumbnail)
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle(truncateString(title, 256))
        .setDescription(truncateString(description, 4096))
        .setImage(imageURL.checkURL() ? imageURL : null)
        .setFooter({ text: 'Sent by ' + (user.displayName || user.username), iconURL: user.displayAvatarURL(true) })
        .setTimestamp(),
    ];

    await interaction.reply({ embeds });
  },
};
