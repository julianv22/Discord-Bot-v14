const { SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
const economyProfile = require('../../../config/economyProfile');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('withdraw'),
  category: 'sub command',
  scooldown: 0,
  parent: 'economy',

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { user, guild, guildId } = interaction;
    const { errorEmbed, user: bot } = client;
    const amount = interaction.options.getInteger('amount');
    const profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(() => {});

    if (!profile)
      return interaction.reply(
        errorEmbed(true, `Bạn chưa có tài khoản Economy!\n ➡ Sử dụng \`/daily\` để khởi nghiệp 😁`),
      );

    if (amount > profile.bank)
      return interaction.reply(errorEmbed(true, `Số \\💲 rút không được lớn hơn số tiền hiện có!`));

    profile.bank -= amount;
    const fee = Math.floor(amount * 0.01).toLocaleString();
    profile.balance += amount - fee;
    await profile.save().catch(() => {});

    return interaction.reply({
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
      ephemeral: true,
    });
  },
};
