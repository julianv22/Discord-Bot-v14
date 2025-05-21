const {
  SlashCommandBuilder,
  Client,
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps-game')
    .setDescription('RPS game.')
    .addIntegerOption((opt) =>
      opt.setName('bet').setDescription('Số tiền muốn cá cược').setRequired(true).setMinValue(100).setMaxValue(1000000),
    ),
  category: 'misc',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const bet = interaction.options.getInteger('bet');
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`rps-btn:0:${bet}`).setEmoji('🔨').setLabel('Rock').setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`rps-btn:1:${bet}`)
        .setEmoji('📄')
        .setLabel('Paper')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`rps-btn:2:${bet}`)
        .setEmoji('✂️')
        .setLabel('Scissors')
        .setStyle(ButtonStyle.Primary),
    );

    const embed = new EmbedBuilder()
      .setTitle('Rock - Paper - Scissors Game')
      .setDescription(
        `Choose your hand sign! \\🔨-\\📄-\\✂️\nMỗi lần chơi sẽ trừ số tiền ${bet.toLocaleString()}\\💲 bạn đặt cược. Tối đa 10 lần/ngày.`,
      )
      .setColor('Random')
      .setImage(
        'https://cdn.discordapp.com/attachments/976364997066231828/1374106088294842449/rock-paper-scissors-icon-set-on-white-background-vector.png',
      );

    await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
  },
};
