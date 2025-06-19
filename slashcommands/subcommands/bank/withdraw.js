const { SlashCommandSubcommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction } = require('discord.js');
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
    const { errorEmbed, catchError, user: bot } = client;
    const amount = interaction.options.getInteger('amount');

    try {
      let profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error);

      if (!profile)
        return await interaction.reply(
          errorEmbed({
            description: 'Bạn chưa có tài khoản Economy!\n ➡ Sử dụng `/daily` để khởi nghiệp 😁',
            emoji: false,
          }),
        );

      if (amount > profile.bank)
        return await interaction.reply(
          errorEmbed({ desc: 'Số \\💲 rút không được lớn hơn số tiền hiện có!', emoji: false }),
        );

      profile.bank -= amount;
      const fee = Math.floor(amount * 0.01);
      profile.balance += amount - fee;
      await profile.save().catch(console.error);

      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
            .setTitle('\\🏦 Withdraw')
            .setDescription(
              `\\✅ Rút ${toCurrency(amount, locale)} thành công!\n\nBạn bị trừ ${toCurrency(
                fee,
                locale,
              )} (1%) phí rút tiền còn ${toCurrency(amount - fee, locale)}.`,
            )
            .addFields(
              { name: 'Số dư hiện có:', value: '\u200b', inline: false },
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
            )
            .setColor(0x00ff00)
            .setThumbnail(cfg.economyPNG)
            .setFooter({ text: 'Rất hân hạn được phục vụ bạn!', iconURL: bot.displayAvatarURL(true) })
            .setTimestamp(),
        ],
        flags: 64,
      });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
