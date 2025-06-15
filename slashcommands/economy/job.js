const { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const jobs = require('../../config/economy/economyJobs.json');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('job').setDescription('Get a random job and earn 💲!'),
  /**
   * Get a random job and earn 💲!
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { user, guild, guildId } = interaction;
    const { errorEmbed, catchError } = client;

    try {
      let profile = await economyProfile.findOne({ guildID: guildId, userID: user.id }).catch(console.error);
      if (!profile)
        return await interaction.reply(
          errorEmbed({
            description: 'Bạn chưa có tài khoản Economy!\n ➡ Sử dụng `/daily` để khởi nghiệp 😁',
            emoji: false,
          }),
        );

      // Cooldown cố định 6 tiếng
      const now = new Date();
      const cooldownMs = 6 * 60 * 60 * 1000;
      if (profile.lastJob && now - new Date(profile.lastJob) < cooldownMs) {
        const finishTime = new Date(new Date(profile.lastJob).getTime() + cooldownMs);
        const timeleft = Math.floor(finishTime.getTime() / 1000);
        return await interaction.reply(
          errorEmbed({
            description: `Bạn đang làm việc hoặc trong thời gian chờ (6h)!\n ↪ Hãy quay lại sau: <t:${timeleft}:R>`,
            emoji: false,
          }),
        );
      }

      // Random job và thời gian làm việc
      const jobKeys = Object.keys(jobs);
      const jobName = jobs[jobKeys[Math.floor(Math.random() * jobKeys.length)]];
      const minMinutes = 180,
        maxMinutes = 360;
      const workMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
      profile.lastJob = now;
      profile.lastRob = now;
      profile.lastWork = jobName;
      await profile.save().catch(console.error);

      // Hiển thị thời gian làm việc
      const workTimeStr =
        workMinutes >= 60
          ? `**${Math.floor(workMinutes / 60)} giờ${workMinutes % 60 ? ` : ${workMinutes % 60} phút` : ''}**`
          : `**${workMinutes} phút**`;

      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle('Bạn đã nhận một công việc mới!')
        .setDescription(
          `\\👷‍♀️ Công việc: **${jobName}**\n\n\\⏳ Thời gian làm việc: ${workTimeStr}\n\n\\💡 Sau khi hoàn thành, bạn sẽ nhận được **${workMinutes.toLocaleString()}**\\💲!\n\nBạn sẽ nhận được thông báo khi hoàn thành công việc.`,
        )
        .setColor('Random')
        .setThumbnail(cfg.economyPNG)
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL() })
        .setTimestamp();

      setTimeout(async () => {
        let reward = workMinutes;
        let lucky = Math.random() < 0.25;
        if (lucky) reward *= 2;
        await user
          .send(
            `🎉 Bạn đã hoàn thành công việc **${jobName}** tại guild **${
              guild.name
            }**\n\n💰 Bạn đã nhận được **${reward.toLocaleString()}**💲!${
              lucky ? '\n\n✨ May mắn! Chủ thuê hài lòng với bạn, bạn nhận được gấp đôi tiền công!' : ''
            }`,
          )
          .catch(console.error);

        let p = await economyProfile.findOne({ guildID: guildId, userID: user.id }).catch(console.error);
        if (p) {
          p.balance += reward;
          p.totalEarned += reward;
          p.lastRob = null;
          await p.save().catch(console.error);
        }
      }, workMinutes * 60 * 1000);

      return await interaction.reply({ embeds: [embed], flags: 64 });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
