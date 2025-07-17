const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'welcome-menu' },
  /** - Welcome channel select menu
   * @param {Interaction} interaction Channel Select Menu Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const {
      guildId,
      message: { components },
      customId,
      values,
    } = interaction;
    const [, selected] = customId.split(':');
    const welcomeSection = components[1].components[0].components[1].data;
    const logSection = components[1].components[0].components[2].data;

    const setupWelcome = {
      welcomechannel: async () => {
        welcomeSection.content = `- \\💬 Welcome channel: <#${values[0]}>`;
        await serverProfile
          .findOneAndUpdate({ guildId }, { $set: { 'welcome.channelId': values[0] } })
          .catch(console.error);
      },
      logchannel: async () => {
        logSection.content = `- \\📋 Log channel: <#${values[0]}>`;
        await serverProfile
          .findOneAndUpdate({ guildId }, { $set: { 'welcome.logChannelId': values[0] } })
          .catch(console.error);
      },
    };

    if (!setupWelcome[selected]()) throw new Error(chalk.yellow('Invalid selected', chalk.green(selected)));
    await interaction.update({ components });
  },
};
