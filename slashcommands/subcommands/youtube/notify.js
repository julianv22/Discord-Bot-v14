const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('notify'),
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  /**
   * Setup Youtube notify channel
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   * @returns {Promise<void>}
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, guildId } = interaction;
    const notifyChannel = options.getChannel('notify-channel');
    if (!notifyChannel) {
      return await interaction.reply(errorEmbed(true, 'Kênh thông báo không hợp lệ'));
    }
    try {
      const profile = await serverProfile
        .findOneAndUpdate(
          { guildID: guildId },
          { $set: { youtubeNotifyChannel: notifyChannel.id } },
          { new: true, upsert: true },
        )
        .catch(() => {});
      return await interaction.reply(
        errorEmbed(false, `Đã thiết lập kênh thông báo video mới trên YouTube: ${notifyChannel}`),
      );
    } catch (e) {
      console.error(chalk.red('Error (/setup youtube):', e));
      return await interaction.reply(
        errorEmbed(true, 'Có lỗi xảy ra khi thiết lập kênh thông báo video mới trên Youtube', e),
      );
    }
  },
};
