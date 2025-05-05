const serverProfile = require(`../../../config/serverProfile`);
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('welcome-message').setDescription(`Welcome Message`),
  category: 'sub command',

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const welcomeMSG = options.getString('message');
    let profile = await serverProfile.findOne({ guildID: guild.id });

    if (!profile) {
      let createOne = await serverProfile.create({
        guildID: guild.id,
        guildName: guild.name,
      });
      createOne.save();
    }
    interaction.reply({
      embeds: [
        {
          color: 65280,
          title: '\\✅ | Setup Welcome message successfully!',
          description: `Content: ${welcomeMSG || 'None'}`,
        },
      ],
      ephemeral: true,
    });
    await serverProfile.findOneAndUpdate({ guildID: guild.id }, { guildName: guild.name, welomeMessage: welcomeMSG });
  },
};
