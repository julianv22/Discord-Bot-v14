const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('bulk-delete')
    .setDescription(`Bulk delete messages. ${cfg.adminRole} only`)
    .addIntegerOption((opt) =>
      opt.setName('amount').setDescription('Number of messages (between 1 and 100)').setRequired(true),
    )
    .addUserOption((opt) => opt.setName('user').setDescription('Filter messages by user')),
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, channel, user: author } = interaction;
    // const message = await interaction.deferReply({ fetchReply: true });
    const amount = options.getInteger('amount');
    const user = options.getUser('user');

    if (amount < 1 || amount > 100)
      return interaction.reply(errorEmbed(true, `Number of messages must be between \`1 and 100\``));

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
      await interaction.reply(errorEmbed(false, `Deleted ${actualAmount} messages!` + (user ? ` of ${user}` : '')));
    } catch (e) {
      console.error(chalk.red('Error (/bulk-delete):', e));
      return interaction.reply(errorEmbed(true, 'Something went wrong while bulk deleting messages', e));
    }
  },
};
