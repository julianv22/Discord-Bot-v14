const { Client, Interaction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Retrieve recently deleted messages')
    .addUserOption((opt) =>
      opt.setName('target').setDescription('Provide the user whose deleted messages you want to retrieve')
    ),
  /** Snipe a deleted message
   * @param {Interaction} interaction Command Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    await client.snipeMessage(interaction.options.getUser('target'), interaction);
  },
};
