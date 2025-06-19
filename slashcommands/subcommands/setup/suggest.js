const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('suggest'),
  /** - Setup suggest channel
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const { errorEmbed, catchError } = client;
    const channel = options.getChannel('suggest-channel');

    try {
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
      if (!profile)
        profile = await serverProfile
          .create({ guildID: guild.id, guildName: guild.name, prefix: prefix, setup: { suggest: channel.id } })
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
      return await catchError(interaction, e, this);
    }
  },
};
