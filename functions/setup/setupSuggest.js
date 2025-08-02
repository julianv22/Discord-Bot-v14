const { Client, Interaction, ContainerBuilder, SeparatorBuilder, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { dashboardMenu, textDisplay, menuComponents } = require('../common/components');
const { embedMessage } = require('../common/logging');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Sets up the suggestion channel.
   * @param {Interaction} interaction - The command interaction. */
  client.setupSuggest = async (interaction) => {
    const { id: guildId, name: guildName } = interaction.guild;

    const profile = await serverProfile
      .findOneAndUpdate({ guildId }, { guildName, prefix }, { upsert: true, new: true })
      .catch(console.error);
    if (!profile)
      return await interaction.followUp(
        embedMessage({ desc: 'No data found for this server. Please try again later!' })
      );

    /** @param {string} channelId - The ID of the channel. */
    const channelName = (channelId) => interaction.guild.channels.cache.get(channelId) || '\u274C\uFE0F Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addTextDisplayComponents(textDisplay(`### \\⚙️ Suggestion Channel: ${channelName(profile?.suggest?.channelId)}`))
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(menuComponents('suggest-menu', '💡 Select Suggestion Channel'));

    await interaction.editReply({ components: [dashboardMenu('suggest'), container] });
  };
};
