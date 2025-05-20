const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const economyProfile = require('../../config/economyProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Rob :coin: coins from others (has risk and cooldown)')
    .addUserOption((option) =>
      option.setName('target').setDescription('The user you want to rob :coin: coins from').setRequired(true),
    ),
  category: 'economy',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user, guild, options } = interaction;
    const userID = user.id;
    const guildID = guild.id;
    const targetUser = options.getUser('target');
    const now = new Date();
    const cooldownMs = 30 * 60 * 1000; // 30 phút

    if (targetUser.bot) {
      return interaction.reply(errorEmbed(true, `Bạn không thể giật :coin: coin của bot!`));
    }
    if (targetUser.id === userID) {
      return interaction.reply(errorEmbed(true, `Bạn không thể tự giật :coin: coin của chính mình!`));
    }

    // Lấy profile của user và target
    let profile = await economyProfile.findOne({ guildID, userID });
    let targetProfile = await economyProfile.findOne({ guildID, userID: targetUser.id });
    if (!profile || profile.balance < 200) {
      return interaction.reply(errorEmbed(true, `Bạn cần ít nhất 200 :coin: coin để thực hiện giật!`));
    }
    if (!targetProfile || targetProfile.balance < 100) {
      return interaction.reply(errorEmbed(true, `Người này không đủ :coin: coin để bị giật!`));
    }

    // Cooldown
    if (profile.lastRob && now - profile.lastRob < cooldownMs) {
      const nextRob = new Date(profile.lastRob.getTime() + cooldownMs);
      const timeleft = Math.floor(nextRob.getTime() / 1000);
      return interaction.reply(errorEmbed(true, `Bạn vừa giật gần đây! Hãy quay lại sau: <t:${timeleft}:R>`));
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
      amount = Math.min(amount, targetProfile.balance); // Không giật quá số :coin: coin họ có
      profile.balance += amount;
      targetProfile.balance -= amount;
      resultMsg = `\\💸 Bạn đã giật thành công **${amount.toLocaleString()}** :coin: coin từ **${
        targetUser.displayName || targetUser.username
      }**!`;
    } else {
      amount = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
      amount = Math.min(amount, profile.balance); // Không bị trừ quá số :coin: coin mình có
      profile.balance -= amount;
      resultMsg = `\\❌ Bạn đã thất bại và bị mất **${amount.toLocaleString()}** :coin: coin!`;
    }
    profile.lastRob = now;
    await profile.save();
    await targetProfile.save();

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('Giật :coin: coin')
      .setDescription(resultMsg)
      .addFields(
        { name: 'Số dư của bạn', value: `${profile.balance.toLocaleString()} \\💲`, inline: true },
        {
          name: `Số dư của ${targetUser.displayName || targetUser.username}`,
          value: `${targetProfile.balance.toLocaleString()} \\💲`,
          inline: true,
        },
      )
      .setColor(isSuccess ? 'Green' : 'Red')
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL() })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
