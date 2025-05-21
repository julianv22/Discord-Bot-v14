const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const economyProfile = require('../../config/economyProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Rob 💲 from others (has risk and cooldown)')
    .addUserOption((option) =>
      option.setName('target').setDescription('The user you want to rob 💲 from').setRequired(true),
    ),
  category: 'economy',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed, user: bot } = client;
    const { user, guild, options } = interaction;
    const userID = user.id;
    const guildID = guild.id;
    const targetUser = options.getUser('target');
    const now = new Date();
    const cooldownMs = 30 * 60 * 1000; // 30 phút

    if (targetUser.bot) {
      return interaction.reply(errorEmbed(true, `Bạn không thể giật \\💲 của bot!`));
    }
    if (targetUser.id === userID) {
      return interaction.reply(errorEmbed(true, `Bạn không thể tự giật \\💲 của chính mình!`));
    }

    // Lấy profile của user và target
    let profile = await economyProfile.findOne({ guildID, userID }).catch(() => {});
    let targetProfile = await economyProfile.findOne({ guildID, userID: targetUser.id }).catch(() => {});

    if (!profile || !targetProfile)
      return interaction.reply(
        errorEmbed(true, !profile ? `Bạn chưa có tài khoản Economy` : `Đối tượng giật \\💲 chưa có tài khoản Economy`),
      );

    if (profile.balance < 200) {
      return interaction.reply(errorEmbed(true, `Bạn cần ít nhất 200\\💲 để thực hiện giật!`));
    }

    if (targetProfile.balance < 100) {
      return interaction.reply(errorEmbed(true, `Người này không đủ \\💲 để bị giật!`));
    }

    // Cooldown
    if (profile.lastRob && now - profile.lastRob < cooldownMs) {
      const nextRob = new Date(profile.lastRob.getTime() + cooldownMs);
      const timeleft = Math.floor(nextRob.getTime() / 1000);
      return interaction.reply(errorEmbed(true, `Bạn vừa giật \\💲 gần đây! Hãy quay lại sau: <t:${timeleft}:R>`));
    }

    // Tính tỉ lệ thành công
    let successRate = 0.5; // 50%
    // Nếu target là chủ guild
    const guildOwnerId = guild.ownerId;
    if (targetUser.id === guildOwnerId) successRate = 0.1;
    // Nếu target có role cao hơn
    const member = await guild.members.fetch(userID);
    const targetMember = await guild.members.fetch(targetUser.id);
    if (targetMember.roles.highest.comparePositionTo(member.roles.highest) > 0) successRate = 0.4;

    // Xác định thành công/thất bại
    const isSuccess = Math.random() < successRate;
    let amount = 0;
    let resultMsg = '';
    if (isSuccess) {
      amount = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
      amount = Math.min(amount, targetProfile.balance); // Không giật quá số coin họ có
      profile.balance += amount;
      targetProfile.balance -= amount;
      resultMsg = `\\💸 Đã giật thành công **${amount.toLocaleString()}**\\💲!`;
    } else {
      amount = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
      amount = Math.min(amount, profile.balance); // Không bị trừ quá số \\💲 mình có
      profile.balance -= amount;
      targetProfile.balance += Math.round(amount / 2);
      resultMsg = `\\❌ Thất bại và bị mất **${amount.toLocaleString()}**\\💲, đối phương nhận được **${Math.round(
        amount / 2,
      ).toLocaleString()}**\\💲!`;
    }
    profile.lastRob = now;
    await profile.save().catch(() => {});
    await targetProfile.save().catch(() => {});

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setDescription(`**${user}** vừa giật \\💲 của **${targetUser}**\n\n` + resultMsg)
      .addFields(
        {
          name: `Số dư của ${user.displayName || user.username}`,
          value: `${profile.balance.toLocaleString()}\\💲`,
          inline: true,
        },
        {
          name: `Số dư của ${targetUser.displayName || targetUser.username}`,
          value: `${targetProfile.balance.toLocaleString()}\\💲`,
          inline: true,
        },
      )
      .setColor(isSuccess ? 'Green' : 'Red')
      .setThumbnail(cfg.economyPNG)
      .setFooter({
        text: `${isSuccess ? 'Tuyệt vời! 🤗' : 'Chúc may mắn lần sau! 😞'}`,
        iconURL: bot.displayAvatarURL(),
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
