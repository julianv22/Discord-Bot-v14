const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { embedMessage } = require('../../functions/common/logging');
const { getChannelTitle } = require('../../functions/common/serverSetup');

module.exports = {
  type: 'modals',
  data: { name: 'youtube' },
  /** - Add or remove YouTube channel subcribed
   * @param {Interaction} interaction Modal Submit Interaction
   * @param {Client} client Discord Client*/
  async execute(interaction, client) {
    await interaction.deferUpdate();

    const { guildId, message, fields, customId } = interaction;
    const { embeds } = message;
    const [, action] = customId.split(':');
    const channelId = fields.getTextInputValue(action);

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

    const { valid, title } = await validateYoutubeChannel(channelId, process.env.YT_API_KEY);
    if (!valid)
      return await interaction.followUp(embedMessage({ desc: 'Invalid or non-existent YouTube channel ID!' }));

    const refresh = async () => {
      const refresh = await serverProfile.findOne({ guildId });
      const channelList = await Promise.all(
        refresh?.youtube?.channels?.map(async (channelId, id) => {
          const title = await getChannelTitle(channelId, process.env.YT_API_KEY);
          return `${id + 1}. [**${title}**](https://www.youtube.com/channel/${channelId}) - \`${channelId}\``;
        })
      );

      embeds[0].data.description =
        channelList.length > 0 ? channelList.join('\n') : '-# No channel has been subcribed.';
      await interaction.editReply({ embeds });
    };
    const onSubmit = {
      add: async () => {
        const existing = await serverProfile.findOne({ guildId, 'youtube.channels': channelId });
        if (existing) {
          await interaction.followUp(
            embedMessage({
              title: 'Duplicate channel!',
              desc: `Channel **[${title}](https://www.youtube.com/channel/${channelId})** is already in the watchlist.`,
            })
          );
          return false;
        }

        await serverProfile
          .updateOne({ guildId }, { $addToSet: { 'youtube.channels': channelId } }, { upsert: true })
          .catch(console.error);
        return await refresh();
      },
      remove: async () => {
        const result = await serverProfile
          .updateOne({ guildId }, { $pull: { 'youtube.channels': channelId } })
          .catch(console.error);

        // If no document was modified, the channel wasn't in the list.
        if (!result || result.modifiedCount === 0) {
          await interaction.followUp(
            embedMessage({
              title: 'No matching results found!',
              desc: `Channel **[${title}](https://www.youtube.com/channel/${channelId})** is not in the watchlist.`,
            })
          );
          return false;
        }
        return await refresh();
      },
    };

    if (!onSubmit[action]()) throw new Error(chalk.yellow('Invalid submit modal', chalk.green(action)));
  },
};
