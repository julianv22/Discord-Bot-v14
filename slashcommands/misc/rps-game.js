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
      new ButtonBuilder().setCustomId('rock-btn').setEmoji('✊').setLabel('Rock').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('paper-btn').setEmoji('✋').setLabel('Paper').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('scissors-btn').setEmoji('✌').setLabel('Scissors').setStyle(ButtonStyle.Primary),
    );

    const embed = new EmbedBuilder()
      .setTitle('Rock - Paper - Scissors Game')
      .setDescription('Choose your hand sign!')
      .setColor('Random')
      .setImage(
        'https://static.vecteezy.com/system/resources/previews/000/691/497/original/rock-paper-scissors-neon-icons-vector.jpg',
      )
      .setFooter({ text: '✊-✋-✌' });

    interaction.reply({ embeds: [embed], components: [buttons] });
  },
};
