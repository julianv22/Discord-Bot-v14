const { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const { toCurrency, ultilsTest } = require('../../functions/common/utilities');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('View your balance, streak, bank, inventory and achievements'),
  /** View balance, streak, bank, inventory and achievements of a user
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const { errorEmbed, catchError } = client;

    try {
      let profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error);
      if (!profile) {
        return await interaction.reply(
          errorEmbed({
            description: 'Bạn chưa có tài khoản Economy!\n ➡ Sử dụng `/daily` để khởi nghiệp 😁',
            emoji: false,
          }),
        );
      }

      // Lấy thông tin
      const balance = toCurrency(profile.balance || 0, interaction.locale);
      const bank = toCurrency(profile.bank || 0, interaction.locale);
      const streak = (profile.streak || 0).toLocaleString();
      const maxStreak = (profile.maxStreak || 0).toLocaleString();
      const totalEarned = toCurrency(profile.totalEarned || 0, interaction.locale);
      const totalSpent = toCurrency(profile.totalSpent || 0, interaction.locale);
      const inventory = profile.inventory && profile.inventory.length ? profile.inventory.join(', ') : '\\🚫';
      const achievements =
        profile.achievements && profile.achievements.length ? profile.achievements.join(', ') : '\\🚫';
      const work = profile.lastWork || '\\❌ Chưa nhận (`/job` để nhận)';
      const lastJob = profile.lastJob || new Date();

      const embed = new EmbedBuilder()
        .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
        .setTitle('\\💳 Economy Information')
        .addFields(
          { name: '\\💰 Balance', value: balance, inline: true },
          { name: '\\🏦 Bank', value: bank, inline: true },
          { name: '\\🔥 Streak', value: `${streak} / (max: ${maxStreak})`, inline: true },
          { name: 'Tổng số \\💲 đã kiếm được', value: totalEarned, inline: true },
          { name: 'Tổng số \\💲 đã chi tiêu', value: totalSpent, inline: true },
          {
            name: '\u200b',
            value: '```Số 💲 kiếm được/chi tiêu không được tính trong việc giật 💲 (/rob)```',
            inline: false,
          },
          { name: '\\💼 Job', value: `${work} -/- <t:${parseInt(lastJob / 1000)}:R>`, inline: false },
          { name: '\\📦 Inventory', value: inventory, inline: false },
          { name: '\\🏆 Achievements', value: achievements, inline: false },
        )
        .setColor('Random')
        .setThumbnail(cfg.economyPNG)
        .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
        .setTimestamp();

      return await interaction.reply({ embeds: [embed], flags: 64 });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
