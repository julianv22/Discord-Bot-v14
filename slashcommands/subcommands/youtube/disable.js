const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('disable'),
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,

  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, guildId } = interaction;
    const isConfirm = options.getBoolean('confirm');

    if (!isConfirm) return interaction.reply(errorEmbed(true, 'Hãy suy nghĩ lại và sử dụng vào lần tới!'));

    let profile = await serverProfile.findOne({ guildID: guildId });

    if (!profile) return interaction.reply(errorEmbed(true, 'No database'));
    else {
      try {
        profile.youtubeNotifyChannel = '';
        await profile.save();
        await interaction.reply(errorEmbed(false, 'Tạm dừng thông báo video mới trên Youtube thành công!'));
      } catch (e) {
        console.error(chalk.yellow.bold('Error: (/youtube disable'), e);
        return interaction.reply(errorEmbed(true, 'Error:'), e);
      }
    }
  },
};
