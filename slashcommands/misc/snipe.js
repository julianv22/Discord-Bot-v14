const { SlashCommandBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Snipe a deleted message')
    .addUserOption((opt) => opt.setName('user').setDescription('Provide user you wanna snipe')),
  category: 'misc',
  scooldown: 0,
  /**
   * Snipe a deleted message
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    client.snipeMessage(interaction.user, interaction.options.getUser('user'), interaction);
  },
};
