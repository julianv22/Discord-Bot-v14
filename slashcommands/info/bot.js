const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('bot')
    .setDescription("Get bot's informations")
    .addSubcommand((sub) => sub.setName('info').setDescription('Bot info')),
  /** - Bot informations
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.botInfo(interaction);
  },
};
