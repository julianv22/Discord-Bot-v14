const { Client, ChatInputCommandInteraction, Colors } = require('discord.js');
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
    const [notifytype, title, description, imageURL] = [
      fields.getTextInputValue('type'),
      fields.getTextInputValue('title'),
      fields.getTextInputValue('description'),
      fields.getTextInputValue('imageURL'),
    ];

    const thumbnail = [cfg.thongbaoPNG, cfg.updatePNG];

    try {
      return await interaction.reply({
        embeds: [
          {
            author: { name: guild.name, iconURL: guild.iconURL(true) },
            title,
            description,
            color: Colors.DarkVividPink,
            thumbnail: { url: thumbnail[notifytype - 1] },
            image: { url: checkURL(imageURL) ? imageURL : null },
            timestamp: new Date(),
            footer: { text: 'Sent by ' + (user.displayName || user.username), iconURL: user.displayAvatarURL(true) },
          },
        ],
      });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
