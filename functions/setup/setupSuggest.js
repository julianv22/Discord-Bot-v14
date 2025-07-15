const { Client, Interaction, ContainerBuilder, SeparatorBuilder, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { textDisplay, menuComponents, dashboardMenu, sectionComponents } = require('../common/components');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Setup welcome
   * @param {Interaction} interaction - Command Interaction. */
  client.setupSuggest = async (interaction) => {
    const { id: guildID, name: guildName } = interaction.guild;

    let profile = await serverProfile.findOne({ guildID }).catch(console.error);
    if (!profile)
      profile = await serverProfile.create({ guildID, guildName, prefix, setup: { suggest: '' } }).catch(console.error);

    const { suggest } = profile?.setup || {};
    /** @param {string} channelId */
    const channelName = (channelId) => interaction.guild.channels.cache.get(channelId) || '\\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addTextDisplayComponents(textDisplay(`### Suggest Channel: ${channelName(suggest)}`))
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(menuComponents('suggest-menu', 'Select Suggest Channel'));

    await interaction.editReply({ components: [dashboardMenu(), container] });
  };
};
