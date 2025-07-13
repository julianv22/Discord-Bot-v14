const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  ContainerBuilder,
  SeparatorBuilder,
  ComponentType,
  ButtonStyle,
  MessageFlags,
  Colors,
} = require('discord.js');
const serverProfile = require('../../../config/serverProfile');
const { sectionComponents, textDisplay, menuComponents } = require('../../../functions/common/components');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('welcome'),
  /** - Sets up the welcome channel with a welcome message and a log channel.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild } = interaction;
    const { id: guildID, name: guildName } = guild;

    let profile = await serverProfile.findOne({ guildID }).catch(console.error);

    if (!profile)
      profile = await serverProfile
        .create({ guildID, guildName, prefix, setup: { welcome: { channel: '', log: '', message: '' } } })
        .catch(console.error);

    const { welcome } = profile.setup;
    const welcomeMessage = welcome?.message || '-# \\❌ Not Set';

    /** @param {string} channelId */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '-# \\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkAqua)
      .addSectionComponents(
        sectionComponents(
          [
            '### Welcome Information',
            `- \\💬 Welcome channel: ${channelName(welcome?.channel)}`,
            `- \\💬 Log channel: ${channelName(welcome?.log)}`,
          ],
          ComponentType.Thumbnail,
          { url: guild.iconURL(true) }
        )
      )
      .addSectionComponents(
        sectionComponents(`- \\📝 Welcome message:\n${welcomeMessage}`, ComponentType.Button, {
          customId: 'welcome-msg',
          label: '📝 Change message',
          style: ButtonStyle.Success,
        })
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('Select Welcome channel:'))
      .addActionRowComponents(menuComponents('welcome-menu:channel'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('Select Log channel:'))
      .addActionRowComponents(menuComponents('welcome-menu:log'));

    return await interaction.reply({
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
      components: [container],
    });
  },
};
