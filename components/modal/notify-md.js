const { EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: { name: 'notify-md' },

  /** @param {Interaction} interaction @param {Client} client */
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
        text: 'Sent by ' + user.displayName,
        iconURL: user.displayAvatarURL(true),
      })
      .setTimestamp()
      .setThumbnail(notifytype === '2' ? cfg.updatePNG : cfg.thongbaoPNG)
      .setImage(client.checkURL(imageURL) ? imageURL : null);

    interaction.reply({ embeds: [embed] });
  },
};
