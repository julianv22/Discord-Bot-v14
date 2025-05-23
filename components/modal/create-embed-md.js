const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
module.exports = {
  data: { name: 'create-embed-md' },
  /**
   * Embed Modal
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { checkURL, errorEmbed } = client;
    const { customId, fields, message, user } = interaction;
    const [, type] = customId.split(':');
    const getEmbeds = EmbedBuilder.from(message.embeds[0]);
    const strInput = fields.getTextInputValue(type);
    const Button0 = ActionRowBuilder.from(message.components[0]);
    const Button1 = ActionRowBuilder.from(message.components[1]);
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
      footerInput: async () => {
        const iconURL = fields.getTextInputValue('footerIcon');
        const userName = replaceVar(strInput, user.displayName || user.username, 'user');
        const userAvt = replaceVar(iconURL, user.avatarURL(), 'avt');
        getEmbeds.setFooter({
          text: userName || null,
          iconURL: checkURL(userAvt) ? userAvt : 'https://www.gstatic.com/webp/gallery3/2_webp_ll.webp',
        });
        Button1.components[0].setLabel('⛔Disable Footer').setStyle(ButtonStyle.Danger);
      },
    };
    await editEmbed[type]();
    return await interaction.update({ embeds: [getEmbeds], components: [Button0, Button1] });
    /**
     * Capitalize a string
     * @param {String} str - String to capitalize
     * @returns {String} - Capitalized string
     */
    function capitalize(str) {
      if (!str) return ''; // Handle empty or undefined string
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    /**
     * Replace variables in a string
     * @param {string} str - The string to replace variables in
     * @param {string} replace - The string to replace the variables with
     * @returns {string} - The string with the variables replaced
     */
    function replaceVar(str, replace, key) {
      let regex = '';
      if (key === 'user') regex = /\{user\}/g;
      else if (key === 'avt') regex = /\{avatar\}/g;
      return str.replace(regex, replace);
    }
  },
};
