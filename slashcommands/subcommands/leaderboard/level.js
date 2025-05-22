const { SlashCommandSubcommandBuilder, Client, Interaction, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('level'),
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  /**
   * Get level leaderboard
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const { errorEmbed, checkURL } = client;
    const { guild, user, options } = interaction;
    const week = options.getInteger('week');
    const imgURL = options.getString('image');

    try {
      if (!checkURL(imgURL)) return interaction.reply(errorEmbed(true, 'Vui lòng nhập chính xác Image URL'));

      const embed = new EmbedBuilder()
        .setAuthor({ name: '🏆 Level Leaderboard', iconURL: user.displayAvatarURL(true) })
        .setTitle('Bảng xếp hạng level tuần #' + week)
        .setDescription(
          'Xem bảng xếp hạng trên 10? [View top 100](https://arcane.bot/leaderboard/954736697453731850)\n\nXem [Rank List](https://discord.com/channels/954736697453731850/954737311843770440/994328694522921030)',
        )
        .setColor('Random')
        .setThumbnail(cfg.thumbnailURL)
        .setImage(imgURL)
        .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.error(chalk.red('Error (/leaderboard level):', e));
      return interaction.reply(errorEmbed(true, 'Error level leaderboard:', e));
    }
  },
};
