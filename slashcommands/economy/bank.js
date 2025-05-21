const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bank')
    .setDescription('Deposit/withdraw 💲 from bank')
    .addSubcommand((sub) =>
      sub
        .setName('deposit')
        .setDescription('Deposit 💲 from balance to bank')
        .addIntegerOption((opt) => opt.setName('amount').setDescription('Amount of 💲 to deposit').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('withdraw')
        .setDescription('Withdraw 💲 from bank to balance')
        .addIntegerOption((opt) => opt.setName('amount').setDescription('Amount of 💲 to withdraw').setRequired(true)),
    ),
  category: 'economy',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
