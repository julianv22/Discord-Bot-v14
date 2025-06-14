const { SlashCommandBuilder, Client, CommandInteraction, PermissionFlagsBits, Colors } = require('discord.js');

module.exports = {
  category: 'administrator',
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
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { options, channel, user: author } = interaction;
    const { errorEmbed, catchError } = client;
    const [amount, user] = [options.getInteger('amount'), options.getUser('user')];

    try {
      const messages = await channel.messages.fetch({ limit: amount });
      const actualAmount = Math.min(messages.size, amount);
      let filtered = [];

      if (user) {
        let i = 0;
        messages.filter((m) => {
          if (author.id === user.id && amount + 1 > i) {
            filtered.push(m);
            i++;
          }
        });
      }

      await channel.bulkDelete(user ? filtered : actualAmount, user ? null : true);
      return await interaction.reply(
        errorEmbed({ description: `Deleted ${actualAmount} messages!` + (user ? ` of ${user}` : ''), emoji: true }),
      );
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
