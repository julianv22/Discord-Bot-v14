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
  data: new SlashCommandBuilder().setName('rps-game').setDescription('RPS game.'),
  category: 'misc',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('rps-btn:0').setEmoji('🔨').setLabel('Rock').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('rps-btn:1').setEmoji('📄').setLabel('Paper').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('rps-btn:2').setEmoji('✂️').setLabel('Scissors').setStyle(ButtonStyle.Primary),
    );

    const embed = new EmbedBuilder()
      .setTitle('Rock - Paper - Scissors Game')
      .setDescription('Choose your hand sign! \\🔨-\\📄-\\✂️')
      .setColor('Random')
      .setImage(
        'https://cdn.discordapp.com/attachments/976364997066231828/1374106088294842449/rock-paper-scissors-icon-set-on-white-background-vector.png',
      );

    await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
  },
};
