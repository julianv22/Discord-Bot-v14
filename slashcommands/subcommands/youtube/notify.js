const {
  Client,
  Interaction,
  SlashCommandSubcommandBuilder,
  SeparatorBuilder,
  ContainerBuilder,
  ComponentType,
  MessageFlags,
  Colors,
  ButtonStyle,
} = require('discord.js');
const serverProfile = require('../../../config/serverProfile');
const { textDisplay, menuComponents, sectionComponents } = require('../../../functions/common/components');

module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('notify'),
  /** - Sets up the channel for YouTube video notifications.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client  */
  async execute(interaction, client) {
    const { guild } = interaction;
    const { id: guildID, name: guildName, roles } = guild;

    let profile = await serverProfile.findOne({ guildID }).catch(console.error);
    if (!profile)
      profile = await serverProfile
        .create({ guildID, guildName, prefix, youtube: { notifyChannel: '', alert: '' } })
        .catch(console.error);

    const { youtube } = profile || {};
    /** @param {string} channelId */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkAqua)
      .addSectionComponents(
        sectionComponents(
          [
            '### 📢 YouTube Notification Settings',
            `- \\💬 Notification Channel: ${channelName(youtube.notifyChannel)}`,
            `- \\🔔 Alert Role: ${roles.cache.get(youtube.alert) || '\\❌ Not Set'}`,
          ],
          ComponentType.Thumbnail,
          { url: cfg.infoPNG }
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        sectionComponents(
          'Select the notification channel:\n-# \\⚠️ This channel will be used to send notifications when a new video is uploaded.',
          ComponentType.Button,
          { customId: 'youtube:notify', label: '💬 Remove Channel', style: ButtonStyle.Danger }
        )
      )
      .addActionRowComponents(menuComponents('youtube-menu:notify'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        sectionComponents(
          'Select the alert role:\n-# \\⚠️ This role will be mentioned in the notification.',
          ComponentType.Button,
          { customId: 'youtube:alert', label: '🔔 Remove Alert', style: ButtonStyle.Danger }
        )
      )
      .addActionRowComponents(menuComponents('youtube-menu:alert', null, ComponentType.RoleSelect));

    await interaction.reply({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], components: [container] });
  },
};
