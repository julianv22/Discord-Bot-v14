const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { replaceVar } = require('../../functions/common/utilities');

module.exports = {
  type: 'modals',
  data: { name: 'manage-embed' },
  /** - Embed Modal Manager
   * @param {Interaction} interaction Modal Submit Interaction
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

    if (!message) return await interaction.reply(client.errorEmbed({ desc: 'Cannot find the message!' }));

    const onSubmit = {
      author: () => {
        const authorIcon = fields.getTextInputValue('authorIcon');
        const iconURL = replaceVar(authorIcon, replaceKey);

        return embed.setAuthor({
          name: replaceVar(inputValue, replaceKey) || null,
          iconURL: iconURL.checkURL() ? iconURL : null,
        });
      },
      title: () => embed.setTitle(inputValue || null),
      description: () => embed.setDescription(replaceVar(inputValue, replaceKey)),
      color: () => embed.setColor(inputValue.toEmbedColor()),
      image: () => embed.setImage(inputValue.checkURL() ? inputValue : null),
      thumbnail: () => embed.setThumbnail(inputValue.checkURL() ? inputValue : null),
      footer: () => {
        const footerIcon = fields.getTextInputValue('footerIcon');
        const iconUrl = replaceVar(footerIcon, replaceKey);

        return embed.setFooter({
          text: replaceVar(inputValue, replaceKey) || null,
          iconURL: iconUrl.checkURL() ? iconUrl : null,
        });
      },
      addfield: () => {
        const fieldvalue = fields.getTextInputValue('fieldvalue');
        const inline = fields.getTextInputValue('inline');
        return embed.addFields({ name: inputValue, value: fieldvalue, inline: inline === '1' ? true : false });
      },
    };

    if (!onSubmit[textInputId]())
      throw new Error(chalk.yellow("Invalid TextInput's customId"), chalk.green(textInputId));
    await interaction.update({ embeds: [embed] });
  },
};
