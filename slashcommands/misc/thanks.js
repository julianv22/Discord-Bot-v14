const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

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
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    await client.thanksUser(interaction.options.getUser('user'), interaction);
  },
};
