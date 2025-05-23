const { Client, Interaction, EmbedBuilder, ActionRowBuilder } = require('discord.js');
module.exports = {
  data: { name: 'create-embed-md' },
  /**
   * Embed Modal
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { checkURL, errorEmbed } = client;
    const { customId, fields, message } = interaction;
    const [, type] = customId.split(':');
    const getEmbeds = EmbedBuilder.from(message.embeds[0]);
    const strInput = fields.getTextInputValue(type);
    const embedColors = [
      'Red',
      'Blue',
      'Green',
      'Yellow',
      'LuminousVividPink', // Một màu hồng rực rỡ
      'Fuchsia',
      'Gold',
      'Orange',
      'Purple',
      'DarkAqua',
      'DarkGreen',
      'DarkBlue',
      'DarkPurple',
      'DarkVividPink',
      'DarkGold',
      'DarkOrange',
      'DarkRed',
      'DarkGrey', // Còn được gọi là 'DarkGray'
      'Navy',
      'Aqua', // Còn được gọi là 'Cyan'
      'Blurple', // Màu đặc trưng của Discord
      'Greyple',
      'DarkButNotBlack', // Màu xám đậm hơn một chút so với đen
      'NotQuiteBlack', // Màu đen nhưng không hoàn toàn đen
      'White',
      'Default', // Màu mặc định của Discord (xám đen)
      'Random',
    ];
    const editEmbed = {
      titleInput: () => {
        getEmbeds.setTitle(strInput);
      },
      descriptionInput: () => {
        getEmbeds.setDescription(strInput);
      },
      colorInput: async () => {
        const colors = embedColors.map((c) => c.toLowerCase());
        if (colors.includes(strInput.toLowerCase())) getEmbeds.setColor(capitalize(strInput.toLowerCase()));
        else await interaction.reply(errorEmbed(true, 'Tên màu không chính xác'));
      },
      imageInput: () => {
        if (!strInput) getEmbeds.setImage(null);
        else if (checkURL(strInput)) getEmbeds.setImage(strInput);
      },
      thumbnailInput: () => {
        if (!strInput) getEmbeds.setThumbnail(null);
        else if (checkURL(strInput)) getEmbeds.setThumbnail(strInput);
      },
    };
    await editEmbed[type]();
    return await interaction.update({ embeds: [getEmbeds] });
    /**
     * Capitalize a string
     * @param {String} str - String to capitalize
     * @returns {String} - Capitalized string
     */
    function capitalize(str) {
      if (!str) return ''; // Handle empty or undefined string
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  },
};
