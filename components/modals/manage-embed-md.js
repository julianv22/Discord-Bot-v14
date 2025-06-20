const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { checkURL, replaceVar, getEmbedColor } = require('../../functions/common/utilities');

module.exports = {
  type: 'modals',
  data: { name: 'manage-embed-md' },
  /** - Embed Modal
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { customId, fields, message, user, guild } = interaction;
    const { catchError } = client;
    const [, part] = customId.split(':');
    const strInput = fields.getTextInputValue(part);
    const getEmbeds = EmbedBuilder.from(message.embeds[0]);
    const [Button0, Button1] = [
      ActionRowBuilder.from(message.components[0]),
      ActionRowBuilder.from(message.components[1]),
    ];
    const replaceKey = {
      user: user.displayName || user.username,
      guild: guild.name,
      iconURL: guild.iconURL(),
      avatar: user.avatarURL(),
    };

    if (!message) return await interaction.reply(errorEmbed({ desc: 'No message found', emoji: false }));

    try {
      const editEmbed = {
        author: () => {
          if (strInput.length > 256) strInput = strInput.slice(0, 256);
          const authorIcon = fields.getTextInputValue('authorIcon');
          const iconURL = replaceVar(authorIcon, replaceKey);
          return getEmbeds.setAuthor({
            name: replaceVar(strInput, replaceKey) || null,
            iconURL: checkURL(iconURL) ? iconURL : null,
          });
        },
        title: () => {
          if (strInput.length > 256) strInput = strInput.slice(0, 256);
          return getEmbeds.setTitle(strInput);
        },
        description: () => {
          if (strInput.length > 4096) strInput = strInput.slice(0, 4096);
          return getEmbeds.setDescription(replaceVar(strInput, replaceKey));
        },
        color: () => {
          return getEmbeds.setColor(getEmbedColor(strInput));
        },
        image: () => {
          if (!strInput) return getEmbeds.setImage(null);
          else if (checkURL(strInput)) return getEmbeds.setImage(strInput);
        },
        thumbnail: () => {
          if (!strInput) return getEmbeds.setThumbnail(null);
          else if (checkURL(strInput)) return getEmbeds.setThumbnail(strInput);
        },
        footer: async () => {
          if (strInput.length > 2048) strInput = strInput.slice(0, 2048);
          const footerIcon = fields.getTextInputValue('footerIcon');
          const iconUrl = replaceVar(footerIcon, replaceKey);
          return getEmbeds.setFooter({
            text: replaceVar(strInput, replaceKey) || null,
            iconURL: checkURL(iconUrl) ? iconUrl : 'https://www.gstatic.com/webp/gallery3/2_webp_ll.webp',
          });
        },
      };

      if (!editEmbed[part]) throw new Error(chalk.yellow("Invalid Modal's customId ") + chalk.green(part));
      else await editEmbed[part]();
      return await interaction.update({ embeds: [getEmbeds], components: [Button0, Button1] });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
