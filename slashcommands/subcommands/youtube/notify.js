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
const { sectionComponents, textDisplay, rowComponents } = require('../../../functions/common/components');
const { embedMessage } = require('../../../functions/common/logging');

module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('notify'),
  /** - Sets up the channel for YouTube video notifications and alert roles.
   * @param {Interaction} interaction - The command interaction object.
   * @param {Client} client - The Discord client instance. */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const { guild, guildId } = interaction;
    const { name: guildName } = guild;

    const profile = await serverProfile
      .findOneAndUpdate({ guildId }, { guildName, prefix }, { upsert: true, new: true })
      .catch(console.error);
    if (!profile)
      return await interaction.editReply(embedMessage({ desc: 'No data found for this server. Try again later!' }));

    const { youtube } = profile || {};

    /** @param {string} channelId - The ID of the channel. */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\u274C\uFE0F Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkAqua)
      .addSectionComponents(
        sectionComponents(
          [
            '### 📢 YouTube Notification Information',
            `- \\💬 Notification Channel: ${channelName(youtube?.notifyChannelId)}`,
            `- \\🔔 Alert Role: ${guild.roles.cache.get(youtube?.alertRoleId) || '\u274C\uFE0F Not Set'}`,
          ],
          cfg.youtubeIcon, //'https://cdn.discordapp.com/attachments/976364997066231828/1396849360033284197/You-Tube-logo-social-media-video-sharing-transparent-PNG-image.png'
          ComponentType.Thumbnail
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
          { customId: 'youtube:remove:notify', label: '💬 Remove Channel', style: ButtonStyle.Danger }
        )
      )
      .addActionRowComponents(
        rowComponents(ComponentType.ChannelSelect, {
          customId: 'youtube-menu:notify',
          placeholder: '💬 Select Notification Channel',
        })
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        sectionComponents(['Alert role:', '-# \\⚠️ This role will be mentioned in the notification.'], {
          customId: 'youtube:remove:alert',
          label: '🔔 Remove Alert',
          style: ButtonStyle.Danger,
        })
      )
      .addActionRowComponents(
        rowComponents(ComponentType.RoleSelect, { customId: 'youtube-menu:alert', placeholder: '🔔 Select Alert Role' })
      );

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  },
};
