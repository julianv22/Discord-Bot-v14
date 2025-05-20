const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economyProfile = require('../../config/economyProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('View your balance, streak, bank, inventory and achievements'),
  category: 'economy',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id });
    if (!profile) {
      return interaction.reply(errorEmbed(true, 'Bạn chưa có tài khoản Economy!'));
    }

    // Lấy thông tin
    const balance = (profile.balance || 0).toLocaleString();
    const bank = (profile.bank || 0).toLocaleString();
    const streak = (profile.streak || 0).toLocaleString();
    const maxStreak = (profile.maxStreak || 0).toLocaleString();
    const inventory = profile.inventory && profile.inventory.length ? profile.inventory.join(', ') : 'None';
    const achievements = profile.achievements && profile.achievements.length ? profile.achievements.join(', ') : `\\❌`;
    const work = profile.work || `\\❌`;

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
      .setTitle(`\\💳 Thông tin tài khoản Economy`)
      .addFields(
        { name: `\\💰 Số dư`, value: `${balance} \\💲`, inline: true },
        { name: `\\🏦 Ngân hàng`, value: `${bank} \\💲`, inline: true },
        { name: `\\🔥 Streak`, value: `${streak} / (max: ${maxStreak})`, inline: true },
        { name: `\\💼 Công việc`, value: work, inline: true },
        { name: `\\📦 Inventory`, value: inventory, inline: false },
        { name: `\\🏆 Thành tựu`, value: achievements, inline: false },
      )
      .setColor('Random')
      .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
