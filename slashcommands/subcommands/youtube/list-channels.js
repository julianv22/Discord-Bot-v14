const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  EmbedBuilder,
  Colors,
} = require('discord.js');
const serverProfile = require('../../../config/serverProfile');
module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('list-channels'),
  /** - Get list of Youtube channels
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, guildId } = interaction;
    const { errorEmbed } = client;

    /** - Get channel title
     * @param {string} channelId - ID of the Youtube channel
     * @param {string} apiKey - API key for Youtube */
    const getChannelTitle = async (channelId, apiKey) => {
      try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`,
          res = await fetch(url),
          data = await res.json();

        if (data.items && data.items.length > 0) {
          return data.items[0].snippet.title;
        }
      } catch (e) {
        console.error(chalk.red('Error while executing function getChannelTitle:\n'), e);
      }
      return channelId;
    };

    let profile = await serverProfile.findOne({ guildID: guildId }).catch(console.error);
    const { youtube } = profile;

    if (!profile || youtube.channels.length == 0)
      return await interaction.reply(errorEmbed({ desc: 'Danh sách kênh Youtube trống!' }));

    const channelList = await Promise.all(
      youtube.channels.map(async (id, idx) => {
        const title = await getChannelTitle(id, process.env.YT_API_KEY);
        return `${idx + 1}. [${title}](https://www.youtube.com/channel/${id}) - \`${id}\``;
      })
    );

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('Danh sách kênh Youtube đã đăng ký:')
      .setDescription(channelList.join('\n'))
      .setColor(Colors.DarkAqua)
      .setThumbnail(cfg.youtubePNG)
      .setTimestamp()
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });

    return await interaction.reply({ embeds: [embed] });
  },
};
