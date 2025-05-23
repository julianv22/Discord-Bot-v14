const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
const economyProfile = require('../../../config/economyProfile');
const { EmbedBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('deposit'),
  category: 'sub command',
  scooldown: 0,
  parent: 'bank',
  /**
   * Deposit money
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const { errorEmbed, user: bot } = client;
    const amount = interaction.options.getInteger('amount');
    if (amount <= 0) return await interaction.reply(errorEmbed(true, `Số \\💲 gửi phải lớn hơn 0!`));
    const profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(() => {});

    if (!profile)
      return await interaction.reply(
        errorEmbed(true, `Bạn chưa có tài khoản Economy!\n ➡ Sử dụng \`/daily\` để khởi nghiệp 😁`),
      );
    if (amount > profile.balance)
      return await interaction.reply(
        errorEmbed(
          true,
          `Số \\💲 gửi không được lớn hơn số tiền hiện có!\n ➡ Sử dụng \`/balance\` để kiểm tra số 💲 hiện có`,
        ),
      );

    profile.balance -= amount;
    profile.bank += amount;
    await profile.save().catch(() => {});

    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
          .setTitle(`\\🏦 Deposit`)
          .setDescription(`\\✅ Gửi ${amount.toLocaleString()}\\💲 vào ngân hàng thành công!`)
          .addFields(
            { name: `Số dư hiện có:`, value: `\u200b`, inline: false },
            { name: `\\💰 Balance`, value: `${profile.balance.toLocaleString()}\\💲`, inline: true },
            { name: `\\🏦 Bank`, value: `${profile.bank.toLocaleString()}\\💲`, inline: true },
          )
          .setColor(0x00ff00)
          .setThumbnail(cfg.economyPNG)
          .setFooter({ text: `Rất hân hạn được phục vụ bạn!`, iconURL: bot.displayAvatarURL(true) })
          .setTimestamp(),
      ],
      ephemeral: true,
    });
  },
};
