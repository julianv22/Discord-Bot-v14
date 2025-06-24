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
    const [, input] = customId.split(':');
    const strInput = fields.getTextInputValue(input);
    const embed = EmbedBuilder.from(message.embeds[0]);
    const Button0 = ActionRowBuilder.from(message.components[0]);
    const Button1 = ActionRowBuilder.from(message.components[1]);
    const replaceKey = {
      user: user.displayName || user.username,
      guild: guild.name,
      iconURL: guild.iconURL(),
      avatar: user.avatarURL(),
    };

    if (!message) return await interaction.reply(errorEmbed({ desc: 'No message found' }));

    const editEmbed = {
      author: () => {
        const authorIcon = fields.getTextInputValue('authorIcon');
        const iconURL = replaceVar(authorIcon, replaceKey);

        return embed.setAuthor({
          name: replaceVar(strInput.length > 256 ? strInput.slice(0, 256) : strInput, replaceKey) || null,
          iconURL: checkURL(iconURL) ? iconURL : null,
        });
      },
      title: () => {
        return embed.setTitle(strInput.length > 256 ? strInput.slice(0, 256) : strInput);
      },
      description: () => {
        return embed.setDescription(
          replaceVar(strInput.length > 4096 ? strInput.slice(0, 4096) : strInput, replaceKey)
        );
      },
      color: () => {
        return embed.setColor(getEmbedColor(strInput));
      },
      image: () => {
        return embed.setImage(strInput && checkURL(strInput) ? strInput : null);
      },
      thumbnail: () => {
        return embed.setThumbnail(strInput && checkURL(strInput) ? strInput : null);
      },
      footer: async () => {
        const footerIcon = fields.getTextInputValue('footerIcon');
        const iconUrl = replaceVar(footerIcon, replaceKey);

        return embed.setFooter({
          text: replaceVar(strInput.length > 2048 ? strInput.slice(0, 2048) : strInput, replaceKey) || null,
          iconURL: checkURL(iconUrl) ? iconUrl : 'https://www.gstatic.com/webp/gallery3/2_webp_ll.webp',
        });
      },
    };

    if (!editEmbed[input]) throw new Error(chalk.yellow("Invalid Modal's customId ") + chalk.green(input));
    await editEmbed[input]();

    return await interaction.update({ embeds: [embed], components: [Button0, Button1] });
  },
};
