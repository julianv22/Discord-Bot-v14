const { Client, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 30,
  data: new SlashCommandBuilder()
    .setName('thanks')
    .setDescription('Thank someone')
    .addUserOption((opt) => opt.setName('user').setDescription('The user you want to thank').setRequired(true)),
  /** - Thanks someone
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.thanksUser(interaction.options.getUser('user'), interaction);
  },
};
