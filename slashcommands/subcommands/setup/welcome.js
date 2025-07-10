const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SectionBuilder,
  ThumbnailBuilder,
  ChannelSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ChannelType,
  ButtonStyle,
  MessageFlags,
  Colors,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

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
    const { cache: channels } = client.channels;
    const profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);

    if (!profile)
      profile = await serverProfile
        .create({ guildID: guild.id, guildName: guild.name, prefix: prefix })
        .catch(console.error);

    const { welcome } = profile.setup;
    const welcomeChannel = channels.get(welcome.channel) || '- # \\❌ Not Set';
    const welcomeMessage = welcome.message || '- # \\❌ Not Set';
    const logChannel = channels.get(welcome.log) || '- # \\❌ Not Set';

    /** @param {string} content TextDisplay content */
    const text = (content) => new TextDisplayBuilder().setContent(content);

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        new SectionBuilder()
          .setThumbnailAccessory(new ThumbnailBuilder().setURL(guild.iconURL()))
          .addTextDisplayComponents(text('### Welcome Information'))
          .addTextDisplayComponents(text(`**- Welcome channel:** ${welcomeChannel}`))
          .addTextDisplayComponents(text(`**- Log channel:** ${logChannel}`))
      )
      .addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(text(`**- Welcome message:** ${welcomeMessage}`))
          .setButtonAccessory(
            new ButtonBuilder().setCustomId('welcome-msg').setLabel('📝 Change message').setStyle(ButtonStyle.Success)
          )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(text('Select Welcome channel:'))
      .addActionRowComponents(
        new ActionRowBuilder().setComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId('welcome-menu:channel')
            .setChannelTypes(ChannelType.GuildText)
            .setMinValues(1)
            .setMaxValues(1)
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(text('Select Log channel:'))
      .addActionRowComponents(
        new ActionRowBuilder().setComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId('welcome-menu:log')
            .setChannelTypes(ChannelType.GuildText)
            .setMinValues(1)
            .setMaxValues(1)
        )
      );

    return await interaction.reply({
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
      components: [container],
    });
  },
};
