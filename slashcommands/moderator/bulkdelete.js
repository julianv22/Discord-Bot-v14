const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('bulk-delete')
    .setDescription(`Bulk-Delete Messages. ${cfg.adminRole} only`)
    .addIntegerOption((opt) =>
      opt.setName('amount').setDescription('Number of messages between [1 - 100]').setRequired(true),
    )
    .addUserOption((opt) => opt.setName('user').setDescription('Filter by user')),
  category: 'moderator',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, channel, user: author } = interaction;
    // const message = await interaction.deferReply({ fetchReply: true });
    const amount = options.getInteger('amount');
    const user = options.getUser('user');

    if (amount < 0 || amount > 100)
      return interaction.reply(errorEmbed(true, `Number of messages between \`[1 - 100]\``));

    try {
      const messages = await channel.messages.fetch({ limit: amount });
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

      await channel.bulkDelete(user ? filtered : amount, user ? null : true);
      await interaction.reply(errorEmbed(false, `Deleted ${amount} messages!` + (user ? ` of ${user}` : '')));
    } catch (e) {
      interaction.reply(errorEmbed(true, 'Something wrong when bulk deleting messages', e));
      console.error(chalk.yellow.bold('BulkDelete Message', e));
    }
  },
};
