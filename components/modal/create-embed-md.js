const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { getEmbedColor } = require('../../functions/common/embeds');
const { checkURL } = require('../../functions/common/utilities');
module.exports = {
  data: { name: 'create-embed-md' },
  /**
   * Embed Modal
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { customId, fields, message, user } = interaction;
    if (!message) return await interaction.reply(errorEmbed(true, 'No message found'));
    const [, part] = customId.split(':');
    const strInput = fields.getTextInputValue(part);
    const getEmbeds = EmbedBuilder.from(message.embeds[0]);
    const Button0 = ActionRowBuilder.from(message.components[0]);
    const Button1 = ActionRowBuilder.from(message.components[1]);
    const editEmbed = {
      title: () => {
        getEmbeds.setTitle(strInput);
      },
      description: () => {
        getEmbeds.setDescription(strInput);
      },
      color: () => {
        getEmbeds.setColor(getEmbedColor(strInput));
      },
      image: () => {
        if (!strInput) getEmbeds.setImage(null);
        else if (checkURL(strInput)) getEmbeds.setImage(strInput);
      },
      thumbnail: () => {
        if (!strInput) getEmbeds.setThumbnail(null);
        else if (checkURL(strInput)) getEmbeds.setThumbnail(strInput);
      },
      footer: async () => {
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
    if (typeof editEmbed[part] === 'function') await editEmbed[part]();
    return await interaction.update({ embeds: [getEmbeds], components: [Button0, Button1] });
    /**
     * Replace variables in a string
     * @param {string} str - The string to replace variables in
     * @param {string} replace - The string to replace the variables with
     * @returns {string} - The string with the variables replaced
     */
    function replaceVar(str, replace, key) {
      let regex = '';
      // Replace user variable
      if (key === 'user') regex = /\{user\}/g;
      // Replace avatar variable
      else if (key === 'avt') regex = /\{avatar\}/g;
      // Return string with variables replaced
      return str.replace(regex, replace);
    }
  },
};
