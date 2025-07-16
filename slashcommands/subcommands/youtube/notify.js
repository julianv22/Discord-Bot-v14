const {
  Client,
  Interaction,
  SlashCommandSubcommandBuilder,
  SeparatorBuilder,
  ContainerBuilder,
  ComponentType,
  ButtonStyle,
  MessageFlags,
  Colors,
} = require('discord.js');
const serverProfile = require('../../../config/serverProfile');
const { menuComponents, sectionComponents, textDisplay } = require('../../../functions/common/components');

module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('notify'),
  /** - Sets up the channel for YouTube video notifications and alert roles.
   * @param {Interaction} interaction - The command interaction object.
   * @param {Client} client - The Discord client instance. */
  async execute(interaction, client) {
    const { guild } = interaction;
    const { id: guildID, name: guildName, roles } = guild;

    let profile = await serverProfile.findOne({ guildID }).catch(console.error);
    if (!profile)
      profile = await serverProfile
        .create({ guildID, guildName, prefix, youtube: { notifyChannel: '', alert: '' } })
        .catch(console.error);

    const { youtube } = profile || {};

    /** @param {string} channelId - The ID of the channel. */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkAqua)
      .addSectionComponents(
        sectionComponents(
          [
            '### 📢 YouTube Notification Information',
            `- \\💬 Notification Channel: ${channelName(youtube.notifyChannel)}`,
            `- \\🔔 Alert Role: ${roles.cache.get(youtube.alert) || '\\❌ Not Set'}`,
          ],
          ComponentType.Thumbnail,
          cfg.infoPNG
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('### \\⚙️ Setup \\⤵️'))
      .addSectionComponents(
        sectionComponents(
          [
            'Notification channel:',
            '-# \\⚠️ This channel will be used to send notifications when a new video is uploaded.',
          ],
          ComponentType.Button,
          { customId: 'youtube:remove:notify', label: '💬 Remove Channel', style: ButtonStyle.Danger }
        )
      )
      .addActionRowComponents(menuComponents('youtube-menu:notify', '💬 Select Notification Channel'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        sectionComponents(
          ['Alert role:', '-# \\⚠️ This role will be mentioned in the notification.'],
          ComponentType.Button,
          { customId: 'youtube:remove:alert', label: '🔔 Remove Alert', style: ButtonStyle.Danger }
        )
      )
      .addActionRowComponents(menuComponents('youtube-menu:alert', '🔔 Select Alert Role', ComponentType.RoleSelect));

    await interaction.reply({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], components: [container] });
  },
};
