const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('suggest'),
  /**
   * Setup suggest channel
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const { errorEmbed, catchError, channels } = client;
    const channel = options.getChannel('suggest-channel');

    try {
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
      if (!profile)
        profile = await serverProfile
          .create({ guildID: guild.id, guildName: guild.name, prefix: cfg.prefix, setup: { suggest: channel.id } })
          .catch(console.error);

      if (!profile.setup) profile.setup = {};

      profile.setup.suggest = channel.id;
      await profile.save().catch(console.error);

      return await interaction.reply(
        errorEmbed({
          description: `Channel to send suggestions has been changed to ${channel}!`,
          emoji: true,
        }),
      );
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
