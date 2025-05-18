const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('disable').setDescription('Disable Starboard System'),
  category: 'starboard',
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, guildId } = interaction;
    const isConfirm = options.getBoolean('disable-confirm');

    if (!isConfirm) return interaction.reply(errorEmbed(true, 'Hãy chắc chắn với điều bạn đang làm!'));

    let profile = await serverProfile.findOne({ guildID: guildId });

    if (profile.starCount === 0) {
      return interaction.reply(
        errorEmbed(true, 'Starboard System chưa được setup. Sử dụng `/setup starboard` để cài đặt'),
      );
    } else {
      profile.starboardChannel = null;
      profile.starCount = 0;
      await profile.save();
      await interaction.reply(errorEmbed(false, 'Disable Starboard System successfully!'));
    }
  },
};
