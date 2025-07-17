const { Client, Interaction, ContainerBuilder, SeparatorBuilder, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { textDisplay, menuComponents, dashboardMenu } = require('../common/components');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Setup welcome
   * @param {Interaction} interaction - Command Interaction. */
  client.setupSuggest = async (interaction) => {
    const { errorEmbed } = client;
    const { id: guildId, name: guildName } = interaction.guild;

    const profile = await serverProfile
      .findOneAndUpdate({ guildId }, { guildName, prefix }, { upsert: true, new: true })
      .catch(console.error);
    if (!profile)
      return await interaction.followUp(errorEmbed({ desc: 'No data found for this server. Try again later!' }));

    /** @param {string} channelId */
    const channelName = (channelId) => interaction.guild.channels.cache.get(channelId) || '\\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addTextDisplayComponents(textDisplay(`### \\⚙️ Suggest Channel: ${channelName(profile?.suggest?.channelId)}`))
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(menuComponents('suggest-menu', '💡 Select Suggest Channel'));

    await interaction.editReply({ components: [dashboardMenu(), container] });
  };
};
