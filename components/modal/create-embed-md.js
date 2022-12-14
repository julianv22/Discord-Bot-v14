const { EmbedBuilder, Colors, Client, Interaction } = require('discord.js');

module.exports = {
  data: { name: 'create-embed-md' },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { checkURL } = client;
    const { user, guild, fields } = interaction;
    const title = fields.getTextInputValue('title');
    const description = fields.getTextInputValue('description');
    const color = fields.getTextInputValue('color');
    const thumbnailURL = fields.getTextInputValue('thumbnailURL');
    const imageURL = fields.getTextInputValue('imageURL');

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL(true) })
      .setTitle(title)
      .setDescription(description)
      .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
      .setTimestamp()
      .setColor(color == Colors ? color : 'Random')
      .setThumbnail(checkURL(thumbnailURL) ? thumbnailURL : null)
      .setImage(checkURL(imageURL) ? imageURL : null);

    interaction.reply({ embeds: [embed] });
  },
};
