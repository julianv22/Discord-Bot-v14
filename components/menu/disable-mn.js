const serverProfile = require('../../config/serverProfile');
const { EmbedBuilder, Client, Interaction } = require('discord.js');

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
      await interaction.reply({
        embeds: [
          {
            color: 5763719,
            title: `\✅ Disabled **${feature}** successfully!`,
            description: `Vui lòng kiểm tra trong \`/setup info\``,
          },
        ],
        ephemeral: true,
      });
    } catch (e) {
      console.error(chalk.yellow.bold('Error (/setup disable):', e));
      return interaction.reply(errorEmbed(true, 'Disable menu error:', e));
    }
  },
};
