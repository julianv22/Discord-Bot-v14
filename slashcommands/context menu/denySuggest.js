const { ContextMenuCommandBuilder, Client, Interaction, ApplicationCommandType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder().setDefaultMemberPermissions(8).setName('Deny Suggest').setType(ApplicationCommandType.Message),
  category: 'context menu',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { targetMessage: msg } = interaction;

    if (msg.author.id !== cfg.clientID)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | This messages does not belong to ${client.user}!` }],
        ephemeral: true,
      });

    const embed = msg.embeds[0];

    if (!embed) return interaction.reply({ embeds: [{ color: 16711680, description: `\\❌ | This is not suggest message!` }], ephemeral: true });

    if (embed.title !== `Suggest's content:`)
      return interaction.reply({ embeds: [{ color: 16711680, description: `\\❌ | This is not suggest message!` }], ephemeral: true });

    const edit = EmbedBuilder.from(embed).setColor('Red').setFields({ name: '\u200b', value: `\`🚫 Đề xuất không được chấp nhận!\`` });
    await msg.edit({ embeds: [edit] });

    interaction.reply({
      embeds: [{ color: 16711680, description: `\\🚫 | Suggestion is denied! [[Jump Link](${msg.url})]` }],
      ephemeral: true,
    });
  },
};
