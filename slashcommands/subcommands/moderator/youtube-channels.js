const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

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
  data: new SlashCommandSubcommandBuilder().setName('youtube-channels'),
  category: 'sub command',
  parent: 'list',
  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, guildId } = interaction;
    try {
      let profile = await serverProfile.findOne({ guildID: guildId });
      if (!profile || profile.youtubeChannelIds.length == 0)
        return interaction.reply(errorEmbed(true, 'Danh sách kênh Youtube trống!'));

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
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: `Requested by ${user.displayName}`, iconURL: user.displayAvatarURL(true) });

      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.error('Lỗi hiển thị danh sách kênh Youtube', e);
      return interaction.reply(errorEmbed(true, 'Lỗi hiển thị danh sách kênh Youtube'), e);
    }
  },
};
