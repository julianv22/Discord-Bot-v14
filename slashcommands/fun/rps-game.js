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
  /** Play a Rock-Paper-Scissors game.
   * @param {Interaction} interaction Command Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 64 });

    const { options } = interaction;
    const bet = options.getInteger('bet');

    const buttons = [
      { customId: `rps-game:rock:${bet}`, emoji: '✊', label: 'Rock', style: ButtonStyle.Primary },
      { customId: `rps-game:paper:${bet}`, emoji: '🖐️', label: 'Paper', style: ButtonStyle.Success },
      { customId: `rps-game:scissors:${bet}`, emoji: '✌️', label: 'Scissors', style: ButtonStyle.Danger },
    ];

    const components = [new ActionRowBuilder().setComponents(rowComponents(ComponentType.Button, buttons))];

    const embeds = [
      new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 0xffffff))
        .setThumbnail(cfg.game_gif)
        .setTitle('Rock - Paper - Scissors Game')
        .setDescription(
          `**Choose your hand sign:** [\`✊ | 🖐️ | ✌️\`]\n- Mỗi lần chơi sẽ trừ số tiền ${bet.toCurrency()} đặt cược.\n- Tối đa 50 lần/ngày.`
        )
        .setImage(cfg.rpsPNG),
    ];

    await interaction.editReply({ embeds, components });
  },
};
