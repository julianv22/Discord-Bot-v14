const { ContextMenuCommandBuilder, EmbedBuilder, Client, Interaction, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder().setDefaultMemberPermissions(8).setName('Deny Suggest').setType(ApplicationCommandType.Message),
  category: 'context menu',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { targetMessage: msg } = interaction;

    if (msg.author.id !== clientID)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | This messages does not belong to ${client.user}!` }],
        ephemeral: true,
      });

    const suggest = [
      `\`✅ | Đề xuất đã được chấp nhận!\``,
      `\`🚫 | Đề xuất không được chấp nhận!\``,
      `\`❗ | Đề xuất sẽ được xem xét và trả lời sớm nhất!\``,
    ];

    if (msg.content === suggest[0] || msg.content === suggest[1] || msg.content === suggest[2]) {
      msg.edit(suggest[1]);
      interaction.reply({
        embeds: [{ color: 16711680, description: `\\🚫 | Suggestion is denied! [[Jump Link](${msg.url})]` }],
        ephemeral: true,
      });
    } else {
      interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | This message is not Suggest Message` }],
        ephemeral: true,
      });
    }
  },
};
