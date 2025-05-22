const { SlashCommandBuilder, Client, Interaction } = require('discord.js');
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
  /**
   * Gửi tiền từ balance sang bank hoặc rút tiền từ bank sang balance
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {},
};
