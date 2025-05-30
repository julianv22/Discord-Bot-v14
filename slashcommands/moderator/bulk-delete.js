const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');
module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('bulk-delete')
    .setDescription(`Bulk delete messages. ${cfg.adminRole} only`)
    .addIntegerOption((opt) =>
      opt
        .setName('amount')
        .setDescription('Number of messages (between 1 and 100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true),
    )
    .addUserOption((opt) => opt.setName('user').setDescription('Filter messages by user')),
  /**
   * Bulk delete messages
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, channel, user: author } = interaction;
    const amount = options.getInteger('amount');
    const user = options.getUser('user');

    try {
      const messages = await channel.messages.fetch({ limit: amount });
      const actualAmount = Math.min(messages.size, amount);
      if (user) {
        let i = 0;
        let filtered = [];
        messages.filter((m) => {
          if (author.id === user.id && amount + 1 > i) {
            filtered.push(m);
            i++;
          }
        });
      }

      await channel.bulkDelete(user ? filtered : actualAmount, user ? null : true);
      return await interaction.reply(
        errorEmbed({ description: `Deleted ${actualAmount} messages!` + (user ? ` of ${user}` : ''), emoji: false }),
      );
    } catch (e) {
      console.error(chalk.red('Error while executing /bulk-delete command', e));
      return await interaction.reply(
        errorEmbed({ title: `\\❌ | Something went wrong while bulk deleting messages`, description: e, color: 'Red' }),
      );
    }
  },
};
