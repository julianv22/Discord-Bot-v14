const {
  Client,
  Interaction,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new ContextMenuCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('Deny Suggestion')
    .setType(ApplicationCommandType.Message),
  /** - Denies a suggestion.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { targetMessage, guild } = interaction;
    const { embedMessage } = client;
    const suggestEmbed = EmbedBuilder.from(targetMessage.embeds[0]);
    const footer = suggestEmbed.data.footer.text;

    if (targetMessage.author.id !== cfg.clientID)
      return await interaction.reply(embedMessage({ desc: 'This message does not belong to bot!' }));

    if (!suggestEmbed) return await interaction.reply(embedMessage({ desc: 'This message is not a suggest message!' }));

    if (footer !== `${guild.name} Suggestion` && footer === 'Suggestion denied')
      return await interaction.reply(embedMessage({ desc: 'This suggestion has been denied!' }));

    suggestEmbed.setColor(Colors.DarkRed).setFields().setTimestamp().setFooter({
      text: 'Suggestion denied',
      iconURL: cfg.x_mark_gif,
    });

    await targetMessage.edit({ embeds: [suggestEmbed] });

    await interaction.reply(embedMessage({ desc: 'Suggestion has been denied!' }));
  },
};
