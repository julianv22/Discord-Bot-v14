const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('suggest'),
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed, channels } = client;
    const { guild, options } = interaction;
    const channel = options.getChannel('schannel');
    const sgtChannel = await channels.cache.get(channel.id);
    let profile = await serverProfile.findOne({ guildID: guild.id });
    if (!profile) {
      let createOne = await serverProfile.create({
        guildID: guild.id,
        guildName: guild.name,
      });
      createOne.save;
    }

    interaction.reply(errorEmbed(false, `Channel to send suggestions has been changed to ${channel}!`));

    await serverProfile.findOneAndUpdate({ guildID: guild.id }, { guildName: guild.name, suggestChannel: sgtChannel });
  },
};
