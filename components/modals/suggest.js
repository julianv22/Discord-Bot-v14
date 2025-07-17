const { Client, Interaction, EmbedBuilder, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
module.exports = {
  type: 'modals',
  data: { name: 'suggest' },
  /** - Suggest Modal
   * @param {Interaction} interaction Modal Message Modal Submit Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, guildId, user, fields } = interaction;
    const { errorEmbed } = client;
    const description = fields.getTextInputValue('content');

    const profile = await serverProfile.findOne({ guildId }).catch(console.error);

    const { suggest } = profile || {};
    if (!profile || !suggest?.channelId)
      return await interaction.reply(
        errorEmbed({
          desc: `Máy chủ này chưa thiết lập kênh đề xuất. Vui lòng liên hệ đội ngũ ${cfg.adminRole} để được hỗ trợ.`,
        })
      );

    const suggestChannel = guild.channels.cache.get(suggest?.channelId);
    if (!suggestChannel)
      return await interaction.reply(
        client.errorEmbed({ desc: 'Kênh đề xuất không tìm thấy hoặc không hợp lệ. Vui lòng kiểm tra lại cấu hình.' })
      );

    const truncateString = (str, maxLength) => (str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str);

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGold)
        .setThumbnail(cfg.suggestPNG)
        .setAuthor({ name: `Đề xuất của ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTitle('Nội dung đề xuất:')
        .setDescription(truncateString(description, 4096))
        .setFooter({ text: `${guild.name} Suggestion`, iconURL: guild.iconURL(true) })
        .setTimestamp()
        .setFields({ name: '\u200b', value: '❗ Đề xuất sẽ được xem xét và trả lời sớm nhất!' }),
    ];

    const msg = await suggestChannel.send({ embeds });

    await interaction.reply(
      errorEmbed({ desc: `Đề xuất của bạn đã được gửi thành công! [Jump link](${msg.url})]`, emoji: true })
    );
    await Promise.all(['👍', '👎'].map((emoji) => msg.react(emoji)));
  },
};
