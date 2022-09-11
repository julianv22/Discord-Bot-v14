const { SlashCommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('bot-info').setDescription(`Bot's Info`),
  category: 'info',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    client.botInfo(interaction.user, interaction);
  },
};
