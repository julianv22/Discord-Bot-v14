const { Client, Interaction, SlashCommandSubcommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../../config/economyProfile');

module.exports = {
  category: 'sub command',
  scooldown: 0,
  parent: 'bank',
  data: new SlashCommandSubcommandBuilder().setName('withdraw'),
  /** - Withdraw money from your bank account.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const { errorEmbed, user: bot } = client;
    const { id: guildID } = guild;
    const amount = interaction.options.getInteger('amount');

    const profile = await economyProfile.findOne({ guildID, userID: user.id }).catch(console.error);
    if (!profile)
      return await interaction.reply(
        errorEmbed({ desc: 'Bạn chưa có tài khoản Economy!\n ➡ Sử dụng `/daily` để khởi nghiệp 😁' })
      );

    if (amount > profile.bank)
      return await interaction.reply(errorEmbed({ desc: 'Số \\💲 rút không được lớn hơn số tiền hiện có!' }));

    profile.bank -= amount;
    const fee = Math.floor(amount * 0.01);
    profile.balance += amount - fee;
    await profile.save().catch(console.error);

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGold)
        .setThumbnail(cfg.economyPNG)
        .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
        .setTitle('\\🏦 Withdraw')
        .setDescription(
          `\\✅ Rút ${amount.toCurrency()} thành công!\n\nBạn bị trừ ${fee.toCurrency()} (1%) phí rút tiền còn ${(
            amount - fee
          ).toCurrency()}.\n\n**Số dư hiện có:**`
        )
        .setFooter({ text: 'Rất hân hạn được phục vụ bạn!', iconURL: bot.displayAvatarURL(true) })
        .setTimestamp()
        .setFields(
          {
            name: '\\💰 Balance',
            value: profile.balance.toCurrency(),
            inline: true,
          },
          {
            name: '\\🏦 Bank',
            value: profile.bank.toCurrency(),
            inline: true,
          }
        ),
    ];

    return await interaction.reply({ embeds, flags: 64 });
  },
};
