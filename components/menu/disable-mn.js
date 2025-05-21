const serverProfile = require('../../config/serverProfile');
const { EmbedBuilder, Client, Interaction, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: { name: 'disable-mn' },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guildId, values } = interaction;
    const select = values[0];
    let profile = await serverProfile.findOne({ guildID: guildId }).catch(() => {});

    if (!profile) return interaction.reply(errorEmbed(true, 'No database!'));

    let change = false;
    let feature = '';

    try {
      const disableActions = {
        starboard: () => {
          profile.starboardChannel = '';
          profile.starCount = 0;
          return 'Starboard System';
        },
        suggest: () => {
          profile.suggestChannel = '';
          return 'Suggest Channel';
        },
        youtube: () => {
          profile.youtubeNotifyChannel = '';
          return 'Youtube Notify';
        },
        welcome: () => {
          profile.welcomeChannel = '';
          profile.welcomeMessage = '';
          profile.logChannel = '';
          return 'Welcome System';
        },
      };

      if (disableActions[select]) {
        feature = disableActions[select]();
        change = true;
      }

      if (change) await profile.save().catch(() => {});
      const features = [
        {
          label: '⭐ Disable Starboard System',
          value: 'starboard',
          description: 'Tắt chức năng Starboard System',
        },
        {
          label: '💡 Disable Suggest Channel',
          value: 'suggest',
          description: 'Tắt chức năng Suggestion',
        },
        {
          label: '🎬 Disable Youtube Notify',
          value: 'youtube',
          description: 'Tắt thông báo video mới trên Youtube',
        },
        {
          label: '🎉 Disable Welcome System',
          value: 'welcome',
          description: 'Tắt chức năng chào mừng thành viên mới',
        },
      ];
      await interaction.update({
        embeds: [
          {
            color: 5763719,
            description: `\\✅ Disabled **${feature}** successfully!\n\nVui lòng kiểm tra trong \`/setup info\``,
          },
          {
            color: 15844367,
            title: '**\\⚠️ Select feature to disabe \\⚠️**',
          },
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('disable-mn')
              .setMinValues(1)
              .setMaxValues(1)
              .addOptions(features.map((ft) => ({ label: ft.label, value: ft.value, description: ft.description }))),
          ),
        ],
        ephemeral: true,
      });
    } catch (e) {
      console.error(chalk.red('Error while running disable menu):', e));
      return interaction.reply(errorEmbed(true, 'Error while running disable menu:', e));
    }
  },
};
