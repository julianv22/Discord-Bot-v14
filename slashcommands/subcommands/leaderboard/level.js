const { SlashCommandSubcommandBuilder, Client, Interaction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('level'),
  category: 'moderator',
  parent: 'leaderboard',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed, checkURL } = client;
    const { guild, user, options } = interaction;
    const week = options.getInteger('week');
    const imgURL = options.getString('image');

    if (week < 1) return interaction.reply(errorEmbed(true, 'Số tuần phải lớn hơn 0'));
    if (!checkURL(imgURL)) return interaction.reply(errorEmbed(true, 'Vui lòng nhập chính xác Image URL'));

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL(true) })
      .setTitle('Bảng xếp hạng level tuần #' + week)
      .setDescription(
        'Xem bảng xếp hạng trên 10? [View top 100](https://arcane.bot/leaderboard/954736697453731850)\n\nXem [Rank List](https://discord.com/channels/954736697453731850/954737311843770440/994328694522921030)',
      )
      .setColor('Random')
      .setThumbnail(cfg.thumbnailURL)
      .setImage(imgURL)
      .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
