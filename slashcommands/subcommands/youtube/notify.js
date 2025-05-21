const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('notify'),
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,

  /**
   * @param {import('discord.js').Interaction} interaction
   * @param {import('discord.js').Client} client
   * @returns {Promise<void>}
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, guildId } = interaction;
    const notifyChannel = options.getChannel('notify-channel');
    if (!notifyChannel) {
      return interaction.reply(errorEmbed(true, 'Kênh thông báo không hợp lệ'));
    }
    try {
      const profile = await serverProfile
        .findOneAndUpdate(
          { guildID: guildId },
          { $set: { youtubeNotifyChannel: notifyChannel.id } },
          { new: true, upsert: true },
        )
        .catch(() => {});
      await interaction.reply(
        errorEmbed(false, `Đã thiết lập kênh thông báo video mới trên YouTube: ${notifyChannel}`),
      );
    } catch (e) {
      console.error(chalk.red('Error (/setup youtube):', e));
      return interaction.reply(
        errorEmbed(true, 'Có lỗi xảy ra khi thiết lập kênh thông báo video mới trên Youtube', e),
      );
    }
  },
};
