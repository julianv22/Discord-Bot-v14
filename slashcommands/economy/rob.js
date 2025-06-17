const { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Rob 💲 from others (has risk and cooldown)')
    .addUserOption((option) =>
      option.setName('target').setDescription('The user you want to rob 💲 from').setRequired(true),
    ),
  /**
   * Rob 💲 from others (has risk and cooldown)
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    await client.robUser(interaction.options.getUser('target'), interaction);
  },
};
