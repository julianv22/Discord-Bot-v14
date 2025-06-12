const {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');
const { setRowComponent } = require('../../functions/common/components');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('rps-game')
    .setDescription('RPS game.')
    .addIntegerOption((opt) =>
      opt.setName('bet').setDescription('Số tiền muốn cá cược').setRequired(true).setMinValue(100).setMaxValue(1000000),
    ),
  /**
   * Play RPS game
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const bet = interaction.options.getInteger('bet');

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
        `Choose your hand sign! \\🔨-\\📄-\\✂️\nMỗi lần chơi sẽ trừ số tiền ${bet.toLocaleString()}\\💲 bạn đặt cược. Tối đa 10 lần/ngày.`,
      )
      .setColor('Random')
      .setImage(
        'https://cdn.discordapp.com/attachments/976364997066231828/1374106088294842449/rock-paper-scissors-icon-set-on-white-background-vector.png',
      );

    await interaction.reply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(setRowComponent(buttons, ComponentType.Button))],
      flags: 64,
    });
  },
};
