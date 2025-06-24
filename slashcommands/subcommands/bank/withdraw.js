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
  data: new SlashCommandSubcommandBuilder().setName('withdraw'),
  /** - Withdraw money
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guild, locale } = interaction;
    const { errorEmbed, user: bot } = client;
    const amount = interaction.options.getInteger('amount');

    let profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error);
    if (!profile)
      return await interaction.reply(
        errorEmbed({
          desc: 'Bạn chưa có tài khoản Economy!\n ➡ Sử dụng `/daily` để khởi nghiệp 😁',
          emoji: false,
        })
      );

    if (amount > profile.bank)
      return await interaction.reply(errorEmbed({ desc: 'Số \\💲 rút không được lớn hơn số tiền hiện có!' }));

    profile.bank -= amount;
    const fee = Math.floor(amount * 0.01);
    profile.balance += amount - fee;
    await profile.save().catch(console.error);

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
      .setTitle('\\🏦 Withdraw')
      .setDescription(
        `\\✅ Rút ${toCurrency(amount, locale)} thành công!\n\nBạn bị trừ ${toCurrency(
          fee,
          locale
        )} (1%) phí rút tiền còn ${toCurrency(amount - fee, locale)}.\n\n**Số dư hiện có:**`
      )
      .setColor(Colors.DarkGold)
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
        }
      );

    return await interaction.reply({ embeds: [embed], flags: 64 });
  },
};
