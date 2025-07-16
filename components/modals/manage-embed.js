const { Client, Interaction, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { replaceVar } = require('../../functions/common/utilities');

module.exports = {
  type: 'modals',
  data: { name: 'manage-embed' },
  /** - Embed Modal
   * @param {Interaction} interaction Modal Message Modal Submit Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { customId, fields, message, user, guild } = interaction;
    const [, textInputId] = customId.split(':');
    const inputValue = fields.getTextInputValue(textInputId);
    const embed = EmbedBuilder.from(message.embeds[0]);

    const replaceKey = {
      user: user.displayName || user.username,
      guild: guild.name,
      iconURL: guild.iconURL(),
      avatar: user.avatarURL(),
    };

    if (!message) return await interaction.reply(client.errorEmbed({ desc: 'Không tìm thấy tin nhắn!' }));

    const truncateString = (str, maxLength) => (str.length > maxLength ? str.slice(0, maxLength) : str);

    const onSubmit = {
      author: () => {
        const authorIcon = fields.getTextInputValue('authorIcon');
        const iconURL = replaceVar(authorIcon, replaceKey);

        return embed.setAuthor({
          name: replaceVar(truncateString(inputValue, 256), replaceKey) || null,
          iconURL: iconURL.checkURL() ? iconURL : null,
        });
      },
      title: () => {
        if (!inputValue) return embed.setTitle(null);
        else return embed.setTitle(truncateString(inputValue, 256));
      },
      description: () => {
        return embed.setDescription(replaceVar(truncateString(inputValue, 4096), replaceKey));
      },
      color: () => {
        return embed.setColor(inputValue.toEmbedColor());
      },
      image: () => {
        return embed.setImage(inputValue.checkURL() ? inputValue : null);
      },
      thumbnail: () => {
        return embed.setThumbnail(inputValue.checkURL() ? inputValue : null);
      },
      footer: async () => {
        const footerIcon = fields.getTextInputValue('footerIcon');
        const iconUrl = replaceVar(footerIcon, replaceKey);

        return embed.setFooter({
          text: replaceVar(truncateString(inputValue, 2048), replaceKey) || null,
          iconURL: iconUrl.checkURL() ? iconUrl : null,
        });
      },
      addfield: async () => {
        const fieldvalue = fields.getTextInputValue('fieldvalue');
        const inline = fields.getTextInputValue('inline');
        return embed.addFields({ name: inputValue, value: fieldvalue, inline: inline === '1' ? true : false });
      },
    };

    if (!onSubmit[textInputId]) throw new Error(chalk.yellow("Invalid TextInput's customId"), chalk.green(textInputId));
    await onSubmit[textInputId]();
    await interaction.update({ embeds: [embed] });
  },
};
