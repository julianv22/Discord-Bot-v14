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
    const [, input] = customId.split(':');
    const strInput = fields.getTextInputValue(input);
    const embed = EmbedBuilder.from(message.embeds[0]);
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
          return embed.setAuthor({
            name: replaceVar(strInput, replaceKey) || null,
            iconURL: checkURL(iconURL) ? iconURL : null,
          });
        },
        title: () => {
          if (strInput.length > 256) strInput = strInput.slice(0, 256);
          return embed.setTitle(strInput);
        },
        description: () => {
          if (strInput.length > 4096) strInput = strInput.slice(0, 4096);
          return embed.setDescription(replaceVar(strInput, replaceKey));
        },
        color: () => {
          return embed.setColor(getEmbedColor(strInput));
        },
        image: () => {
          if (!strInput) return embed.setImage(null);
          else if (checkURL(strInput)) return embed.setImage(strInput);
        },
        thumbnail: () => {
          if (!strInput) return embed.setThumbnail(null);
          else if (checkURL(strInput)) return embed.setThumbnail(strInput);
        },
        footer: async () => {
          if (strInput.length > 2048) strInput = strInput.slice(0, 2048);
          const footerIcon = fields.getTextInputValue('footerIcon');
          const iconUrl = replaceVar(footerIcon, replaceKey);
          return embed.setFooter({
            text: replaceVar(strInput, replaceKey) || null,
            iconURL: checkURL(iconUrl) ? iconUrl : 'https://www.gstatic.com/webp/gallery3/2_webp_ll.webp',
          });
        },
      };

      if (!editEmbed[input]) throw new Error(chalk.yellow("Invalid Modal's customId ") + chalk.green(input));
      await editEmbed[input]();

      return await interaction.update({ embeds: [embed], components: [Button0, Button1] });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
