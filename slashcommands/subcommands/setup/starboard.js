const { SlashCommandSubcommandBuilder, Client, CommandInteraction } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('starboard'),
  /**
   * Setup starboard
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const { errorEmbed, catchError } = client;
    const channel = options.getChannel('starboard-channel');
    const number = options.getInteger('starnum');

    try {
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
      if (!profile)
        profile = await serverProfile
          .create({ guildID: guild.id, guildName: guild.name, prefix: cfg.prefix })
          .catch(console.error);
      const { starboard } = profile.setup;
      starboard.channel = channel.id;
      starboard.star = number;
      await profile.save().catch(console.error);
      return await interaction.reply(
        errorEmbed({
          description: `Các tin nhắn đạt được ${number}\\⭐ react sẽ được gửi tới channel ${channel}`,
          emoji: true,
        }),
      );
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
