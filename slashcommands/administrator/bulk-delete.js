const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('bulk-delete')
    .setDescription(`Deletes a specified number of messages. ${cfg.adminRole} only`)
    .addIntegerOption((opt) =>
      opt
        .setName('amount')
        .setDescription('The number of messages to delete (1-100).')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((opt) => opt.setName('user').setDescription('Filters messages by a specific user.')),
  /** - Deletes a specified number of messages
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { options, channel } = interaction;
    const { messageEmbed, catchError } = client;
    const amount = options.getInteger('amount');
    const user = options.getUser('user');

    try {
      const messages = await channel.messages.fetch({ limit: amount });
      const actualAmount = Math.min(messages.size, amount);

      let messagesToDelete = actualAmount;
      if (user) messagesToDelete = messages.filter((m) => m.author.id === user.id);

      await channel.bulkDelete(messagesToDelete, true); // Pass true to filter out messages older than 14 days

      const title = `Successfully deleted ${actualAmount} messages`;
      await interaction.reply(
        messageEmbed({ emoji: true, ...(user ? { title, desc: `From ${user}` } : { desc: title }) })
      );
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
