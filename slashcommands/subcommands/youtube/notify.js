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
    const { options, guild } = interaction;
    const { errorEmbed, catchError } = client;
    const notifyChannel = options.getChannel('notify-channel');

    try {
      let profile = await serverProfile.findOne({ guildID: guild.id });

      if (!profile)
        profile = await serverProfile
          .create({ guildID: guild.id, guildName: guild.name, prefix: cfg.prefix })
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
      catchError(interaction, e, this);
    }
  },
};
