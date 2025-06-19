const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('notify'),
  /** Setup Youtube notify channel
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client
   * @returns {Promise<void>} */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const { errorEmbed, catchError } = client;
    const notifyChannel = options.getChannel('notify-channel');

    try {
      let profile = await serverProfile.findOne({ guildID: guild.id });

      if (!profile)
        profile = await serverProfile
          .create({ guildID: guild.id, guildName: guild.name, prefix: prefix })
          .catch(console.error);

      if (!profile.youtube) profile.youtube = {};

      profile.youtube.notifyChannel = notifyChannel.id;
      await profile.save().catch(console.error);

      return await interaction.reply(
        errorEmbed({
          description: `Đã thiết lập kênh thông báo video mới trên YouTube: ${notifyChannel}`,
          emoji: true,
        }),
      );
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
