const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { getEmbedColor } = require('../../functions/common/manage-embed');
const { checkURL, replaceVar } = require('../../functions/common/utilities');
module.exports = {
  data: { name: 'manage-embed-md' },
  /**
   * Embed Modal
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { customId, fields, message, user, guild } = interaction;
    if (!message) return await interaction.reply(errorEmbed(true, 'No message found'));
    const [, part] = customId.split(':');
    const strInput = fields.getTextInputValue(part);
    const getEmbeds = EmbedBuilder.from(message.embeds[0]);
    const Button0 = ActionRowBuilder.from(message.components[0]);
    const Button1 = ActionRowBuilder.from(message.components[1]);
    const replaceKey = {
      user: user.displayName || user.username,
      guild: guild.name,
      iconURL: guild.iconURL(),
      avatar: user.avatarURL(),
    };
    const editEmbed = {
      author: () => {
        const authorIcon = fields.getTextInputValue('authorIcon');
        const iconURL = replaceVar(authorIcon, replaceKey);
        getEmbeds.setAuthor({
          name: replaceVar(strInput, replaceKey),
          iconURL: checkURL(iconURL) ? iconURL : null,
        });
      },
      title: () => {
        getEmbeds.setTitle(strInput);
      },
      description: () => {
        getEmbeds.setDescription(replaceVar(strInput, replaceKey));
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
        const footerIcon = fields.getTextInputValue('footerIcon');
        const iconUrl = replaceVar(footerIcon, replaceKey);
        getEmbeds.setFooter({
          text: replaceVar(strInput, replaceKey) || null,
          iconURL: checkURL(iconUrl) ? iconUrl : 'https://www.gstatic.com/webp/gallery3/2_webp_ll.webp',
        });
      },
    };
    if (typeof editEmbed[part] === 'function') await editEmbed[part]();
    return await interaction.update({ embeds: [getEmbeds], components: [Button0, Button1] });
  },
};
