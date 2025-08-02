const { Client, Interaction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('bank')
    .setDescription('Deposit or withdraw 💲 from your bank account.')
    .addSubcommand((sub) =>
      sub
        .setName('deposit')
        .setDescription('Deposit 💲 from your balance to your bank account.')
        .addIntegerOption((opt) =>
          opt
            .setName('amount')
            .setDescription('The amount of 💲 to deposit.')
            .setMinValue(1_000)
            .setMaxValue(99_999_999)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('withdraw')
        .setDescription('Withdraw 💲 from your bank account to your balance.')
        .addIntegerOption((opt) =>
          opt.setName('amount').setDescription('The amount of 💲 to withdraw.').setMinValue(100).setRequired(true)
        )
    ),
  /** - Deposit/withdraw money from balance to bank
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {},
};
