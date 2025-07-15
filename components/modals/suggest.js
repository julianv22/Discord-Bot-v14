const { Client, Interaction, EmbedBuilder, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
module.exports = {
  type: 'modals',
  data: { name: 'suggest' },
  /** - Suggest Modal
   * @param {Interaction} interaction Modal Message Modal Submit Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const { errorEmbed } = client;
    const { id: guildID, name: guildName } = guild;
    const description = interaction.fields.getTextInputValue('content');

    const profile = await serverProfile.findOne({ guildID }).catch(console.error);
    if (!profile || !profile?.setup?.suggest)
      return await interaction.reply(
        errorEmbed({
          desc: `Máy chủ này chưa thiết lập kênh đề xuất. Vui lòng liên hệ đội ngũ ${cfg.adminRole} để được hỗ trợ.`,
          emoji: false,
        })
      );

    const sgtChannel = guild.channels.cache.get(profile?.setup?.suggest);
    if (!sgtChannel)
      return await interaction.reply(
        client.errorEmbed({ desc: 'Kênh đề xuất không tìm thấy hoặc không hợp lệ. Vui lòng kiểm tra lại cấu hình.' })
      );

    const truncateString = (str, maxLength) => (str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str);

    const embeds = [
      new EmbedBuilder()
        .setAuthor({ name: `${user.tag}'s suggestions`, iconURL: user.displayAvatarURL(true) })
        .setTitle('Nội dung đề xuất:')
        .setDescription(truncateString(description, 4096))
        .setColor(Colors.DarkGold)
        .setThumbnail(cfg.suggestPNG)
        .setTimestamp()
        .setFooter({ text: guildName, iconURL: guild.iconURL(true) })
        .addFields({ name: '\u200b', value: '❗ Đề xuất sẽ được xem xét và trả lời sớm nhất!' }),
    ];

    const msg = await sgtChannel.send({ embeds });

    await interaction.reply(
      errorEmbed({ desc: `Đề xuất của bạn đã được gửi thành công! [[Jump link](${msg.url})]`, emoji: true })
    );

    try {
      await Promise.all(['👍', '👎'].map((e) => msg.react(e)));
    } catch (e) {
      client.catchError(interaction, e, 'Lỗi khi thêm reaction vào tin nhắn đề xuất');
    }
  },
};
