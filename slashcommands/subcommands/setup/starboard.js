const { Client, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('starboard'),
  /** - Sets up the starboard channel and star count.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const { errorEmbed } = client;
    const channel = options.getChannel('starboard-channel');
    const number = options.getInteger('starnum');

    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
    if (!profile)
      profile = await serverProfile
        .create({ guildID: guild.id, guildName: guild.name, prefix: prefix })
        .catch(console.error);

    const { starboard } = profile.setup;
    starboard.channel = channel.id;
    starboard.star = number;

    await profile.save().catch(console.error);
    return await interaction.reply(
      errorEmbed({
        desc: `Messages with ${number}\\⭐ reactions will be sent to ${channel}.`,
        emoji: true,
      })
    );
  },
};
