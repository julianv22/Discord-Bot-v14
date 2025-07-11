const { Client, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('notify'),
  /** - Sets up the channel for YouTube video notifications.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const { errorEmbed } = client;
    const { id: guildID, name: guildName } = guild;
    const notifyChannel = options.getChannel('notify-channel');

    let profile = await serverProfile.findOne({ guildID });

    if (!profile) profile = await serverProfile.create({ guildID, guildName, prefix }).catch(console.error);

    if (!profile.youtube) profile.youtube = {};

    profile.youtube.notifyChannel = notifyChannel.id;
    await profile.save().catch(console.error);

    return await interaction.reply(
      errorEmbed({ desc: `YouTube video notification channel has been set to: ${notifyChannel}`, emoji: true })
    );
  },
};
