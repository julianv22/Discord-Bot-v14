const { SlashCommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Snipe a deleted message')
    .addUserOption((opt) => opt.setName('user').setDescription('Provide user you wanna snipe')),
  category: 'misc',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    client.snipeMessage(interaction.user, interaction.options.getUser('user'), interaction);
  },
};
