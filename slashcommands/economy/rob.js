const { Client, Interaction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Rob 💲 from other users (has risk and cooldown).')
    .addUserOption((option) =>
      option.setName('target').setDescription('The user from whom you want to rob 💲.').setRequired(true)
    ),
  /** Rob 💲 from others (has risk and cooldown)
   * @param {Interaction} interaction Command Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    await client.robUser(interaction.options.getUser('target'), interaction);
  },
};
