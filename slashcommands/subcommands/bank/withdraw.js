const { SlashCommandSubcommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
const economyProfile = require('../../../config/economyProfile');

module.exports = {
  category: 'sub command',
  scooldown: 0,
  parent: 'bank',
  data: new SlashCommandSubcommandBuilder().setName('withdraw'),
  /**
   * Withdraw money
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const { errorEmbed, catchError, user: bot } = client;
    const amount = interaction.options.getInteger('amount');

    try {
      let profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error);

      if (!profile)
        return await interaction.reply(
          errorEmbed({
            description: `Bạn chưa có tài khoản Economy!\n ➡ Sử dụng \`/daily\` để khởi nghiệp 😁`,
            emoji: false,
          }),
        );

      if (amount > profile.bank)
        return await interaction.reply(
          errorEmbed({ description: `Số \\💲 rút không được lớn hơn số tiền hiện có!`, emoji: false }),
        );

      profile.bank -= amount;
      const fee = Math.floor(amount * 0.01).toLocaleString();
      profile.balance += amount - fee;
      await profile.save().catch(console.error);

      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
            .setTitle(`\\🏦 Withdraw`)
            .setDescription(
              `\\✅ Rút ${amount.toLocaleString()}\\💲 thành công!\n\nBạn bị trừ ${fee}\\💲 (1%) phí rút tiền còn ${(
                amount - fee
              ).toLocaleString()}\\💲.`,
            )
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
        flags: 64,
      });
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
