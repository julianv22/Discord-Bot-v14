const {
  Client,
  Interaction,
  SlashCommandSubcommandBuilder,
  SeparatorBuilder,
  ContainerBuilder,
  ComponentType,
  ButtonStyle,
  Colors,
  SectionBuilder,
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
    const {
      guild,
      guildId,
      guild: { name: guildName },
    } = interaction;
    const { messageEmbed } = client;

    const profile = await serverProfile
      .findOneAndUpdate({ guildId }, { guildName, prefix }, { upsert: true, new: true })
      .catch(console.error);
    if (!profile)
      return await interaction.reply(messageEmbed({ desc: 'No data found for this server. Try again later!' }));

    const { youtube } = profile || {};

    /** @param {string} channelId - The ID of the channel. */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkAqua)
      .addSectionComponents(
        sectionComponents(
          [
            '### 📢 YouTube Notification Information',
            `- \\💬 Notification Channel: ${channelName(youtube?.notifyChannelId)}`,
            `- \\🔔 Alert Role: ${guild.roles.cache.get(youtube?.alertRoleId) || '\\❌ Not Set'}`,
          ],
          ComponentType.Thumbnail,
          cfg.youtubeIcon //'https://cdn.discordapp.com/attachments/976364997066231828/1396849360033284197/You-Tube-logo-social-media-video-sharing-transparent-PNG-image.png'
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

    await interaction.reply({ components: [container], flags: [32768, 64] });
  },
};
