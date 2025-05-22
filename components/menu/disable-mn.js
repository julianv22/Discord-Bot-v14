const serverProfile = require('../../config/serverProfile');
const { Client, Interaction } = require('discord.js');
module.exports = {
  data: { name: 'disable-mn' },
  /**
   * Tắt tính năng
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
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
        ephemeral: true,
      });
    } catch (e) {
      console.error(chalk.red('Error while running disable menu):', e));
      return interaction.reply(errorEmbed(true, 'Error while running disable menu:', e));
    }
  },
};
