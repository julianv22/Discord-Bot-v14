const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('economy-guide').setDescription('Guide to the economy system'),
  category: 'economy',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user, guild } = interaction;
    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('Economy System - User Guide')
      .setDescription(
        `Hello **${
          user.displayName || user.username
        }**!\n\nĐây là các chức năng chính của hệ thống economy trên server này:`,
      )
      .addFields(
        { name: '/daily', value: `\`\`\`Nhận \\💲 miễn phí mỗi ngày. Qua 0h là có thể nhận tiếp.\`\`\`` },
        { name: '/balance', value: `\`\`\`Xem số dư, streak, bank, inventory, achievements.\`\`\`` },
        { name: '/job', value: `\`\`\`Nhận công việc ngẫu nhiên, làm việc và nhận \\💲 (cooldown).\`\`\`` },
        { name: '/rob', value: `\`\`\`Giật \\💲 của người khác (có rủi ro và cooldown).\`\`\`` },
        { name: '/leaderboard', value: `\`\`\`Xem bảng xếp hạng top giàu nhất.\`\`\`` },
        { name: '/shop', value: `\`\`\`Mua vật phẩm bằng \\💲.\`\`\`` },
        { name: '/inventory', value: `\`\`\`Xem kho đồ/vật phẩm bạn sở hữu.\`\`\`` },
        { name: '/transfer', value: `\`\`\`Chuyển \\💲 cho người khác.\`\`\`` },
        {
          name: '\u200b',
          value: `**Lưu ý:** \`Các lệnh sẽ được cập nhật thêm trong tương lai. Hãy chăm chỉ nhận daily và tham gia các hoạt động để làm giàu nhé❗\``,
        },
      )
      .setColor('Random')
      .setThumbnail(
        'https://media.discordapp.net/attachments/976364997066231828/1374360062063149086/Bitcoin_Digital_Currency_Logo.png',
      )
      .setFooter({ text: `Sent by ${user.tag}`, iconURL: user.displayAvatarURL(true) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
