const { SlashCommandSubcommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('level'),
  /** - Get level leaderboard
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed } = client;
    const week = options.getInteger('week');
    const imgURL = options.getString('image');

    if (!imgURL.checkURL()) return await interaction.reply(errorEmbed({ desc: 'Vui lòng nhập chính xác Image URL' }));

    const embed = new EmbedBuilder()
      .setAuthor({ name: '🏆 Level Leaderboard', iconURL: user.displayAvatarURL(true) })
      .setTitle('Bảng xếp hạng level tuần #' + week)
      .setDescription(
        'Xem bảng xếp hạng trên 10? [View top 100](https://arcane.bot/leaderboard/954736697453731850)\n\nXem [Rank List](https://discord.com/channels/954736697453731850/954737311843770440/994328694522921030)'
      )
      .setColor(Colors.DarkAqua)
      .setThumbnail(cfg.thumbnailURL)
      .setImage(imgURL)
      .setTimestamp()
      .setFooter({ text: guild.name, iconURL: guild.iconURL(true) });

    return await interaction.reply({ embeds: [embed] });
  },
};
