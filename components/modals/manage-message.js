const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { replaceVar } = require('../../functions/common/utilities');
const { linkButton } = require('../../functions/common/components');
const { embedMessage } = require('../../functions/common/logging');

module.exports = {
  type: 'modals',
  data: { name: 'manage-message' },
  /** - Embed Modal Manager
   * @param {Interaction} interaction Modal Submit Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, channel, message, fields, customId } = interaction;
    const [, textInputId] = customId.split(':');

    const replaceKey = {
      user: user.displayName || user.username,
      guild: guild.name,
      iconURL: guild.iconURL(),
      avatar: user.avatarURL(),
    };

    const inputValue = replaceVar(fields.getTextInputValue(textInputId), replaceKey);

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

    if (!message) return await interaction.reply(embedMessage({ desc: 'Cannot find the message!' }));

    await interaction.deferUpdate();

    const embed = EmbedBuilder.from(message.embeds[0]);

    const onSubmit = {
      author: () => {
        const authorIcon = fields.getTextInputValue('authorIcon');
        const iconURL = replaceVar(authorIcon, replaceKey);

        return embed.setAuthor({
          name: inputValue.slice(0, 256) || null,
          iconURL: iconURL.checkURL() ? iconURL : null,
        });
      },
      title: () => embed.setTitle(inputValue.slice(0, 256) || null), // Also work with /reaction role command
      description: () => embed.setDescription(inputValue.slice(0, 4096)),
      color: () => embed.setColor(inputValue.toEmbedColor()), // Also work with /reaction role command
      image: () => embed.setImage(inputValue.checkURL() ? inputValue : null),
      thumbnail: () => embed.setThumbnail(inputValue.checkURL() ? inputValue : null),
      footer: () => {
        const footerIcon = fields.getTextInputValue('footerIcon');
        const iconUrl = replaceVar(footerIcon, replaceKey);

        return embed.setFooter({
          text: inputValue.slice(0, 2048) || null,
          iconURL: iconUrl.checkURL() ? iconUrl : null,
        });
      },
      addfield: () => {
        const fieldvalue = fields.getTextInputValue('fieldvalue');
        const inline = fields.getTextInputValue('inline');
        return embed.addFields({
          name: inputValue.slice(0, 256),
          value: fieldvalue.slice(0, 1024),
          inline: inline === '1' ? true : false,
        });
      },
    };

    if (!onSubmit[textInputId]())
      throw new Error(chalk.yellow("Invalid TextInput's customId"), chalk.green(textInputId));
    await interaction.editReply({ embeds: [embed] });
  },
};
