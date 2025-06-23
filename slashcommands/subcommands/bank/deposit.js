const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  EmbedBuilder,
  Colors,
} = require('discord.js');
const economyProfile = require('../../../config/economyProfile');
const { toCurrency } = require('../../../functions/common/utilities');

module.exports = {
  category: 'sub command',
  scooldown: 0,
  parent: 'bank',
  data: new SlashCommandSubcommandBuilder().setName('deposit'),
  /** - Deposit money
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guild, options, locale } = interaction;
    const { errorEmbed, catchError, user: bot } = client;
    const amount = options.getInteger('amount');

    if (amount <= 0) return await interaction.reply(errorEmbed({ desc: 'Số \\💲 gửi phải lớn hơn 0!', emoji: false }));

    try {
      let profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error);

      if (!profile)
        return await interaction.reply(
          errorEmbed({
            desc: 'Bạn chưa có tài khoản Economy!\n ➡ Sử dụng `/daily` để khởi nghiệp 😁',
            emoji: false,
          }),
        );

      if (amount > profile.balance)
        return await interaction.reply(
          errorEmbed({
            desc: 'Số \\💲 gửi không được lớn hơn số tiền hiện có!\n ➡ Sử dụng `/balance` để kiểm tra số 💲 hiện có',
            emoji: false,
          }),
        );

      profile.balance -= amount;
      profile.bank += amount;
      await profile.save().catch(console.error);

      const embed = new EmbedBuilder()
        .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
        .setTitle('\\🏦 Deposit')
        .setDescription(`\\✅ Gửi ${toCurrency(amount, locale)} vào ngân hàng thành công!\n\n**Số dư hiện có:**`)
        .setColor(Colors.DarkGreen)
        .setThumbnail(cfg.economyPNG)
        .setTimestamp()
        .setFooter({ text: 'Rất hân hạn được phục vụ bạn!', iconURL: bot.displayAvatarURL(true) })
        .addFields(
          {
            name: '\\💰 Balance',
            value: toCurrency(profile.balance, locale),
            inline: true,
          },
          {
            name: '\\🏦 Bank',
            value: toCurrency(profile.bank, locale),
            inline: true,
          },
        );

      return await interaction.reply({ embeds: [embed], flags: 64 });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
