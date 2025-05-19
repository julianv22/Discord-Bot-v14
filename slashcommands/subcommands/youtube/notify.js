const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('notify'),
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, guildId } = interaction;
    const notifyChannel = options.getChannel('notify-channel');
    try {
      let profile = await serverProfile.findOne({ guildID: guildId });
      if (!profile) {
        profile = await serverProfile.create({
          guildID: guildId,
          youtubeNotifyChannel: notifyChannel.id,
        });
      } else {
        profile.youtubeNotifyChannel = notifyChannel.id;
        await profile.save();
      }

      await interaction.reply(
        errorEmbed(false, `Đã thiết lập kênh thông báo video mới trên YouTube: ${notifyChannel}`),
      );
    } catch (e) {
      console.error(chalk.yellow.bold('Error (/setup youtube):', e));
      return interaction.reply(
        errorEmbed(true, 'Có lỗi xảy ra khi thiết lập kênh thông báo video mới trên Youtube', e),
      );
    }
  },
};
