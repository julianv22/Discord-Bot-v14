const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('economy')
    .setDescription('Provides information and commands related to the economy system.')
    .addSubcommand((sub) => sub.setName('guide').setDescription('Displays a guide to the economy system.')),
  /** - Get economy guide
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guild } = interaction;

    const embeds = [
      new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle('Economy System - User Guide')
        .setDescription(
          `Hello **${
            user.displayName || user.username
          }**!\n\nĐây là các chức năng chính của hệ thống economy trên server này:`
        )
        .setColor(Colors.DarkGold)
        .setThumbnail(cfg.economyPNG)
        .setTimestamp()
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .addFields(
          { name: '/daily', value: '```Nhận 💲 miễn phí mỗi ngày. Qua 0h là có thể nhận tiếp.```' },
          { name: '/balance', value: '```Xem số dư, streak, bank, inventory, achievements.```' },
          { name: '/job', value: '```Nhận công việc ngẫu nhiên, làm việc và nhận 💲 (cooldown).```' },
          { name: '/rob', value: '```Giật 💲 của người khác (có rủi ro và cooldown).```' },
          { name: '/leaderboard', value: '```Xem bảng xếp hạng top 🔟 user giàu nhất.```' },
          { name: '/shop', value: '```Mua vật phẩm bằng 💲.```' },
          { name: '/inventory', value: '```Xem kho đồ vật phẩm bạn sở hữu.\n(Đang xây dựng)```' },
          { name: '/bank', value: '```Gửi/rút 💲 vào ngân hàng.```' },
          { name: '/transfer', value: '```Chuyển 💲 cho người khác.```' }
        ),
    ];

    return await interaction.reply({ embeds, flags: 64 });
  },
};
