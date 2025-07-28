const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { replaceVar } = require('../../functions/common/utilities');
const { linkButton } = require('../../functions/common/components');

module.exports = {
  type: 'modals',
  data: { name: 'manage-message' },
  /** - Embed Modal Manager
   * @param {Interaction} interaction Modal Submit Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, channel, message, fields, customId } = interaction;
    const { embedMessage } = client;
    const [, textInputId] = customId.split(':');
    const inputValue = fields.getTextInputValue(textInputId);

    // Handler with /edit message command
    if (textInputId.split('-')[0] === 'message') {
      const messageId = textInputId.split('-')[1];
      const editMsg = channel.messages.cache.get(messageId);

      await editMsg.edit(inputValue.slice(0, 2000));
      return await interaction.reply({
        ...embedMessage({ desc: 'Message has been edited successfully!', emoji: true }),
        components: [linkButton(editMsg.url)],
      });
    }

    await interaction.deferUpdate();

    const embed = EmbedBuilder.from(message.embeds[0]);

    const replaceKey = {
      user: user.displayName || user.username,
      guild: guild.name,
      iconURL: guild.iconURL(),
      avatar: user.avatarURL(),
    };

    if (!message) return await interaction.followUp(client.embedMessage({ desc: 'Cannot find the message!' }));

    const onSubmit = {
      author: () => {
        const authorIcon = fields.getTextInputValue('authorIcon');
        const iconURL = replaceVar(authorIcon, replaceKey);

        return embed.setAuthor({
          name: replaceVar(inputValue, replaceKey) || null,
          iconURL: iconURL.checkURL() ? iconURL : null,
        });
      },
      title: () => embed.setTitle(inputValue || null), // Also work with /reaction role command
      description: () => embed.setDescription(replaceVar(inputValue, replaceKey)),
      color: () => embed.setColor(inputValue.toEmbedColor()), // Also work with /reaction role command
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
    await interaction.editReply({ embeds: [embed] });
  },
};
