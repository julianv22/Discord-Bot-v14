const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 30,
  data: new SlashCommandBuilder()
    .setName('thanks')
    .setDescription('Thanks someone 🤞')
    .addUserOption((opt) =>
      opt.setName('user').setDescription('Provide someone you would like to thank').setRequired(true),
    ),
  /**
   * Thanks someone
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    client.thanksUser(interaction.options.getUser('user'), interaction.user, interaction);
  },
};
