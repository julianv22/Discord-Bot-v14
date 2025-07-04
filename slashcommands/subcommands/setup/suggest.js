const { Client, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('suggest'),
  /** - Sets up the channel for suggestions.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const { errorEmbed } = client;
    const channel = options.getChannel('suggest-channel');

    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
    if (!profile)
      profile = await serverProfile
        .create({ guildID: guild.id, guildName: guild.name, prefix: prefix, setup: { suggest: channel.id } })
        .catch(console.error);

    if (!profile.setup) profile.setup = {};

    profile.setup.suggest = channel.id;
    await profile.save().catch(console.error);

    return await interaction.reply(
      errorEmbed({ desc: `The suggestion channel has been set to ${channel}.`, emoji: true })
    );
  },
};
