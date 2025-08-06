const {
  Client,
  Interaction,
  ContainerBuilder,
  SeparatorBuilder,
  ComponentType,
  ButtonStyle,
  Colors,
  TextInputStyle, // Thêm TextInputStyle
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { dashboardMenu, createModal, textDisplay, sectionComponents, rowComponents } = require('../common/components');
const { embedMessage } = require('../common/logging');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Sets up the welcome system.
   * @param {Interaction} interaction - The command interaction. */
  client.setupWelcome = async (interaction) => {
    const { guild, guildId } = interaction;
    const { name: guildName } = guild;

    const profile = await serverProfile
      .findOneAndUpdate({ guildId }, { guildName, prefix }, { upsert: true, new: true })
      .catch(console.error);
    if (!profile)
      return await interaction.followUp(
        embedMessage({ desc: 'No data found for this server. Please try again later!' })
      );

    const { welcome } = profile || {};
    const welcomeMessage = welcome?.message || '-# \u274C\uFE0F Not Set';

    /** @param {string} channelId - The ID of the channel. */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\u274C\uFE0F Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### \\🎉 Welcome Information',
            `- \\💬 Welcome Channel: ${channelName(welcome?.channelId)}`,
            `- \\📋 Log Channel: ${channelName(welcome?.logChannelId)}`,
          ],
          ComponentType.Thumbnail,
          cfg.infoPNG
        )
      )
      .addSectionComponents(
        sectionComponents(['- \\🗯 Welcome Message', welcomeMessage], ComponentType.Button, {
          customId: 'welcome-msg',
          label: '✍ Change Message',
          style: ButtonStyle.Success,
        })
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('### \\⚙️ Setup \\⤵️'))
      .addActionRowComponents(
        rowComponents(ComponentType.ChannelSelect, {
          customId: 'welcome-menu:welcomechannel',
          placeholder: '💬 Select Welcome Channel',
        })
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        rowComponents(ComponentType.ChannelSelect, {
          customId: 'welcome-menu:logchannel',
          placeholder: '📋 Select Log Channel',
        })
      );

    await interaction.editReply({
      components: [dashboardMenu('welcome'), container],
    });
  };

  // Thêm hàm xử lý nút welcome-msg
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    if (customId === 'welcome-msg') {
      await createModal(interaction, customId, 'Welcome message', {
        customId,
        label: 'Enter the welcome message',
        style: TextInputStyle.Paragraph,
        required: true,
      });
    }
  });
};
