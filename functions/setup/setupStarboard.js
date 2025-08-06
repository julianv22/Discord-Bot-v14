const {
  Client,
  Interaction,
  ContainerBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ComponentType,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { dashboardMenu, textDisplay, sectionComponents, rowComponents } = require('../common/components');
const { embedMessage } = require('../common/logging');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Sets up the Starboard feature.
   * @param {Interaction} interaction - The command interaction. */
  client.setupStarboard = async (interaction) => {
    const { guild, guildId } = interaction;
    const { name: guildName } = guild;

    const profile = await serverProfile
      .findOneAndUpdate({ guildId }, { guildName, prefix }, { upsert: true, new: true })
      .catch(console.error);
    if (!profile)
      return await interaction.reply(embedMessage({ desc: 'No data found for this server. Please try again later!' }));

    const { starboard } = profile || {};

    /** @param {string} channelId - The ID of the channel. */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\u274C\uFE0F Not Set';

    const starCountMenu = [
      { customId: 'starboard-menu:starcount', placeholder: '⭐ Select number of stars' },
      ...Array.from({ length: 20 }, (_, i) => ({
        label: `${i + 1} ⭐`,
        value: `${i + 1}`,
      })),
    ];

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### \u2B50 Starboard Information',
            `- \\💬 Starboard Channel: ${channelName(starboard?.channelId)}`,
            `- \\⭐ Stars required to send message: **${starboard?.starCount || 0}**\\⭐`,
          ],
          ComponentType.Thumbnail,
          cfg.infoPNG
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('### \\⚙️ Setup \\⤵️'))
      .addActionRowComponents(
        rowComponents(ComponentType.ChannelSelect, {
          customId: 'starboard-menu:channel',
          placeholder: '💬 Select Starboard Channel',
        })
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        new ActionRowBuilder().setComponents(rowComponents(ComponentType.StringSelect, starCountMenu))
      );

    await interaction.editReply({ components: [dashboardMenu('starboard'), container] });
  };
};
