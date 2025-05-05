const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('suggest-channel').setDescription(`Suggestions`),
  category: 'sub command',

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const channel = options.getChannel('schannel');
    const sgtChannel = await client.channels.cache.get(channel.id);
    let profile = await serverProfile.findOne({ guildID: guild.id });
    if (!profile) {
      let createOne = await serverProfile.create({
        guildID: guild.id,
        guildName: guild.name,
      });
      createOne.save;
    }

    interaction.reply({
      embeds: [
        {
          color: 65280,
          description: `\\✅ | Channel to send suggestions has been changed to ${channel}!`,
        },
      ],
      ephemeral: true,
    });

    await serverProfile.findOneAndUpdate({ guildID: guild.id }, { guildName: guild.name, suggestChannel: sgtChannel });
  },
};
