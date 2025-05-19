const serverProfile = require('../../config/serverProfile');
const { EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: { name: 'disable-mn' },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guildId, values } = interaction;
    const select = values[0];
    let profile = await serverProfile.findOne({ guildID: guildId });

    if (!profile) return interaction.reply(errorEmbed(true, 'No database!'));

    let change = false;
    let feature = '';

    try {
      switch (select) {
        case 'starboard':
          profile.starboardChannel = '';
          profile.starCount = 0;
          feature = 'Starboard System';
          change = true;
          break;
        case 'suggest':
          profile.suggestChannel = '';
          feature = 'Suggest Channel';
          change = true;
          break;
        case 'youtube':
          profile.youtubeNotifyChannel = '';
          feature = 'Youtube Notify';
          change = true;
          break;
        case 'welcome':
          profile.welcomeChannel = '';
          profile.welcomeMessage = '';
          profile.logChannel = '';
          feature = 'Welcome System';
          change = true;
          break;
        default:
          change = false;
          break;
      }

      if (change) await profile.save();
      await interaction.reply({
        embeds: [
          {
            color: 5763719,
            title: `\\✅ Disable **${feature}** successfully!`,
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
