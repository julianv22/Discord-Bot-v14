const {
  Client,
  Interaction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');
const { rowComponents } = require('../../functions/common/components');

module.exports = {
  category: 'fun',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('rps-game')
    .setDescription('Play a Rock-Paper-Scissors game.')
    .addIntegerOption((opt) =>
      opt
        .setName('bet')
        .setDescription('Amount of coins to bet.')
        .setRequired(true)
        .setMinValue(500)
        .setMaxValue(1000000)
    ),
  /** - Play a Rock-Paper-Scissors game.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { options } = interaction;
    const bet = options.getInteger('bet');

    const buttons = [
      {
        customId: `rps-game:0:${bet}`,
        emoji: '🔨',
        label: 'Rock',
        style: ButtonStyle.Danger,
      },
      {
        customId: `rps-game:1:${bet}`,
        emoji: '📄',
        label: 'Paper',
        style: ButtonStyle.Success,
      },
      {
        customId: `rps-game:2:${bet}`,
        emoji: '✂️',
        label: 'Scissors',
        style: ButtonStyle.Primary,
      },
    ];

    const components = [new ActionRowBuilder().setComponents(rowComponents(ComponentType.Button, buttons))];

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setTitle('Rock - Paper - Scissors Game')
        .setDescription(
          `**Choose your hand sign! \\🔨-\\📄-\\✂️**\n-# Mỗi lần chơi sẽ trừ số tiền ${bet.toCurrency()} bạn đặt cược.\n-# Tối đa 10 lần/ngày.`
        )
        .setImage(
          'https://cdn.discordapp.com/attachments/976364997066231828/1374106088294842449/rock-paper-scissors-icon-set-on-white-background-vector.png'
        ),
    ];

    await interaction.reply({ embeds, components, flags: 64 });
  },
};
