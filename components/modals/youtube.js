const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'modals',
  data: { name: 'youtube' },
  /** - Add or remove YouTube channel subcribed
   * @param {Interaction} interaction Modal Message Modal Submit Interaction
   * @param {Client} client Discord Client*/
  async execute(interaction, client) {
    const {
      customId,
      fields,
      guild,
      message: { embeds },
    } = interaction;
    const { errorEmbed } = client;
    const { id: guildID, name: guildName } = guild;
    const [, action] = customId.split(':');
    const input = fields.getTextInputValue(action);

    /** - Validates a YouTube channel.
     * @param {string} channelId - The ID of the YouTube channel.
     * @param {string} apiKey - The API key for YouTube. */
    const validateYoutubeChannel = async (channelId, apiKey) => {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.items && data.items.length > 0) return { valid: true, title: data.items[0].snippet.title };

      return { valid: false, title: null };
    };

    const { valid, title } = await validateYoutubeChannel(input, process.env.YT_API_KEY);
    if (!valid) return await interaction.reply(errorEmbed({ desc: 'Invalid or non-existent YouTube channel ID!' }));

    /** - Gets the title of a YouTube channel.
     * @param {string} channelId - The ID of the YouTube channel.
     * @param {string} apiKey - The API key for YouTube. */
    const getChannelTitle = async (channelId, apiKey) => {
      try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`,
          res = await fetch(url),
          data = await res.json();

        if (data.items && data.items.length > 0) return data.items[0].snippet.title;
      } catch (e) {
        console.error(chalk.red('Error while executing function getChannelTitle:\n'), e);
      }
      return channelId;
    };

    const refresh = async () => {
      const refresh = await serverProfile.findOne({ guildID });
      const channelList = await Promise.all(
        refresh.youtube.channels.map(async (id, idx) => {
          const title = await getChannelTitle(id, process.env.YT_API_KEY);
          return `${idx + 1}. [**${title}**](https://www.youtube.com/channel/${id}) - \`${id}\``;
        })
      );

      embeds[0].data.description =
        channelList.length > 0 ? channelList.join('\n') : '-# No channel has been subcribed.';
      await interaction.update({ embeds });
    };
    const onSubmit = {
      add: async () => {
        const existing = await serverProfile.findOne({ guildID, 'youtube.channels': input });
        if (existing) {
          await interaction.reply(
            errorEmbed({
              desc: `Channel **[${title}](https://www.youtube.com/channel/${input})** is already in the watchlist.`,
            })
          );
          return false;
        }

        await serverProfile
          .updateOne(
            { guildID },
            {
              $addToSet: { 'youtube.channels': input },
              $setOnInsert: { guildName }, // Only sets guildName on creation
            },
            { upsert: true }
          )
          .catch(console.error);
        return refresh();
      },
      remove: async () => {
        const result = await serverProfile
          .updateOne({ guildID }, { $pull: { 'youtube.channels': input } })
          .catch(console.error);

        // If no document was modified, the channel wasn't in the list.
        if (!result || result.modifiedCount === 0) {
          await interaction.reply(
            errorEmbed({
              desc: `Channel **[${title}](https://www.youtube.com/channel/${input})** is not in the watchlist.`,
            })
          );
          return false;
        }
        return refresh();
      },
    };

    if (!onSubmit[action]()) throw new Error(chalk.yellow('Invalid submit modal', chalk.green(action)));
  },
};
