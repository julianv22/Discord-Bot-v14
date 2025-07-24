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
    .setName('Accept Suggestion')
    .setType(ApplicationCommandType.Message),
  /** - Accepts a suggestion.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { targetMessage, guild } = interaction;
    const { messageEmbed } = client;
    const suggestEmbed = EmbedBuilder.from(targetMessage.embeds[0]);
    const footer = suggestEmbed.data.footer.text;

    if (targetMessage.author.id !== cfg.clientID)
      return await interaction.reply(messageEmbed({ desc: 'This message does not belong to bot!' }));

    if (!suggestEmbed) return await interaction.reply(messageEmbed({ desc: 'This message is not a suggest message' }));

    if (footer !== `${guild.name} Suggestion` && footer === 'Suggestion accepted')
      return await interaction.reply(messageEmbed({ desc: 'This suggestion has been accepted!' }));

    suggestEmbed.setColor(Colors.DarkGreen).setFields().setTimestamp().setFooter({
      text: 'Suggestion accepted',
      iconURL: cfg.verified_gif,
    });

    await targetMessage.edit({ embeds: [suggestEmbed] });

    await interaction.reply(messageEmbed({ desc: 'Suggestion has been accepted!', emoji: true }));
  },
};
