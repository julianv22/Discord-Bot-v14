const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('level-board')
    .setDescription('Level leaderboard')
    .addIntegerOption((opt) => opt.setName('week').setDescription('Tuần').setRequired(true))
    .addStringOption((opt) => opt.setName('image').setDescription('Image URL').setRequired(true)),
  category: 'moderator',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const week = options.getInteger('week');
    const imgURL = options.getString('image');

    if (week < 1)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | Số tuần phải lớn hơn 0` }],
        ephemeral: true,
      });

    if (!client.checkURL(imgURL))
      return interaction.reply({
        embeds: [
          {
            color: 16711680,
            description: `\\❌ | Vui lòng nhập chính xác Image URL`,
          },
        ],
        ephemeral: true,
      });

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
