const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
const fetch = require('node-fetch');
/**
 * Get channel title
 * @param {string} channelId - ID of the Youtube channel
 * @param {string} apiKey - API key for Youtube
 * @returns {Promise<string>}
 */
async function getChannelTitle(channelId, apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].snippet.title;
  }
  return channelId;
}

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('list-channels'),
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  /**
   * Get list of Youtube channels
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, guildId } = interaction;
    try {
      let profile = await serverProfile.findOne({ guildID: guildId }).catch(() => {});
      if (!profile || profile.youtubeChannelIds.length == 0)
        return await interaction.reply(errorEmbed(true, 'Danh sách kênh Youtube trống!'));

      const channelList = await Promise.all(
        profile.youtubeChannelIds.map(async (id, idx) => {
          const title = await getChannelTitle(id, process.env.YT_API_KEY);
          return `${idx + 1}. [${title}](https://www.youtube.com/channel/${id}) - \`${id}\``;
        }),
      );

      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setThumbnail(
          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/YouTube_2024.svg/250px-YouTube_2024.svg.png',
        )
        .setTitle('Danh sách kênh Youtube đã đăng ký:')
        .setDescription(channelList.join('\n'))
        .addFields({
          name: 'Kênh thông báo video mới:',
          value: profile.youtubeNotifyChannel
            ? `<#${profile.youtubeNotifyChannel}>`
            : `\\⚠️ Vui lòng sử dụng \`/youtube notify\` để thiết lập \\⚠️`,
        })
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });

      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.error(chalk.red('Error (/youtube list-channels):', e));
      return await interaction.reply(errorEmbed(true, 'Lỗi hiển thị danh sách kênh Youtube'), e);
    }
  },
};
