const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('notify'),
  /**
   * Setup Youtube notify channel
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   * @returns {Promise<void>}
   */
  async execute(interaction, client) {
    const { options, guildId } = interaction;
    const { errorEmbed, catchError } = client;
    const notifyChannel = options.getChannel('notify-channel');

    if (!notifyChannel) {
      return await interaction.reply(errorEmbed({ description: 'Kênh thông báo không hợp lệ', emoji: false }));
    }

    try {
      await serverProfile
        .findOneAndUpdate(
          { guildID: guildId },
          { $set: { youtube: { notifyChannel: notifyChannel.id } } },
          { new: true, upsert: true },
        )
        .catch((e) => {
          console.error(chalk.red('Error while updating youtube notify channel', e));
        });
      return await interaction.reply(
        errorEmbed({
          description: `Đã thiết lập kênh thông báo video mới trên YouTube: ${notifyChannel}`,
          emoji: true,
        }),
      );
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
