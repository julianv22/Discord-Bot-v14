const {
  Client,
  Interaction,
  ContainerBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { sectionComponents, dashboardMenu, menuComponents, textDisplay } = require('../common/components');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Setup welcome
   * @param {Interaction} interaction - Command Interaction. */
  client.setupStarboard = async (interaction) => {
    const { guild } = interaction;
    const { id: guildID, name: guildName } = guild;

    let profile = await serverProfile.findOne({ guildID }).catch(console.error);
    if (!profile)
      profile = await serverProfile.create({
        guildID,
        guildName,
        prefix,
        setup: { starboard: { channel: '', star: 0 } },
      });

    const { starboard } = profile?.setup || {};

    /** @param {string} channelId */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### Setup Starboard',
            `- \\💬 Starboard channel: ${channelName(starboard?.channel)}`,
            `- \\🔢 Number of stars to send message: **${starboard?.star || 0}**\\⭐`,
          ],
          ComponentType.Thumbnail,
          { url: cfg.infoPNG }
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('### Select options \\⤵️'))
      .addActionRowComponents(menuComponents('starboard-menu:channel', 'Select Starboard channel'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        new ActionRowBuilder().setComponents(
          new StringSelectMenuBuilder()
            .setCustomId('starboard-menu:star')
            .setPlaceholder('Select number of stars')
            .setOptions(
              Array.from({ length: 20 }, (_, i) => ({
                label: `${i + 1} ⭐`,
                value: `${i + 1}`,
              }))
            )
        )
      );

    await interaction.editReply({ components: [dashboardMenu(), container] });
  };
};
