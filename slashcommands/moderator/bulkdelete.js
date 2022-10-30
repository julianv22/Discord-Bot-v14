const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('bulk-delete')
    .setDescription(`Bulk-Delete Messages. ${cfg.adminRole} only`)
    .addIntegerOption(opt => opt.setName('amount').setDescription('Number of messages between [1 - 100]').setRequired(true))
    .addUserOption(opt => opt.setName('user').setDescription('Filter by user')),
  category: 'moderator',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { options, channel, user: author } = interaction;
    // const message = await interaction.deferReply({ fetchReply: true });
    const amount = options.getInteger('amount');
    const user = options.getUser('user');

    if (amount < 0 || amount > 100)
      return interaction.reply({ embeds: [{ color: 16711680, description: `\\❌ | Number of messages between \`[1 - 100]\`!` }], ephemeral: true });

    try {
      const messages = await channel.messages.fetch({ limit: amount });
      if (user) {
        let i = 0;
        let filtered = [];
        messages.filter(m => {
          if (author.id === user.id && amount + 1 > i) {
            filtered.push(m);
            i++;
          }
        });
      }

      await channel.bulkDelete(user ? filtered : amount, user ? null : true);

      await interaction.reply({
        embeds: [{ color: 65280, description: `\\✅ | Deleted ${amount} messages!` + (user ? ` of ${user}` : '') }],
        ephemeral: true,
      });
    } catch (e) {
      interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | Sơmething wrong when bulk deleting messages.\n\`\`\`fix\n${e}\`\`\`` }],
        ephemeral: true,
      });
      console.error('BulkDelete Message', e);
    }
  },
};
