const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bank')
    .setDescription('Deposit/withdraw 💲 from bank')
    .addSubcommand((sub) =>
      sub
        .setName('deposit')
        .setDescription('Deposit 💲 from balance to bank')
        .addIntegerOption((opt) =>
          opt
            .setName('amount')
            .setDescription('Amount of 💲 to deposit')
            .setMinValue(1000)
            .setMaxValue(1000000)
            .setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('withdraw')
        .setDescription('Withdraw 💲 from bank to balance')
        .addIntegerOption((opt) =>
          opt.setName('amount').setDescription('Amount of 💲 to withdraw').setMinValue(100).setRequired(true),
        ),
    ),
  category: 'economy',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
