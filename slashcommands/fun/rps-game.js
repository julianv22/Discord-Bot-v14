const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');
const { rowComponents } = require('../../functions/common/components');
const { toCurrency } = require('../../functions/common/utilities');

module.exports = {
  category: 'fun',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('rps-game')
    .setDescription('RPS game.')
    .addIntegerOption((opt) =>
      opt.setName('bet').setDescription('Bet coins').setRequired(true).setMinValue(500).setMaxValue(1000000),
    ),
  /** - Play RPS game
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { options, locale } = interaction;
    const bet = options.getInteger('bet');

    const buttons = [
      {
        customId: `rps-btn:0:${bet}`,
        emoji: '🔨',
        label: 'Rock',
        style: ButtonStyle.Danger,
      },
      {
        customId: `rps-btn:1:${bet}`,
        emoji: '📄',
        label: 'Paper',
        style: ButtonStyle.Success,
      },
      {
        customId: `rps-btn:2:${bet}`,
        emoji: '✂️',
        label: 'Scissors',
        style: ButtonStyle.Primary,
      },
    ];

    const embed = new EmbedBuilder()
      .setTitle('Rock - Paper - Scissors Game')
      .setDescription(
        `Choose your hand sign! \\🔨-\\📄-\\✂️\nMỗi lần chơi sẽ trừ số tiền ${toCurrency(
          bet,
          locale,
        )} bạn đặt cược. Tối đa 10 lần/ngày.`,
      )
      .setColor('Random')
      .setImage(
        'https://cdn.discordapp.com/attachments/976364997066231828/1374106088294842449/rock-paper-scissors-icon-set-on-white-background-vector.png',
      );

    await interaction.reply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(rowComponents(buttons, ComponentType.Button))],
      flags: 64,
    });
  },
};
