const { SlashCommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Commands List')
    .addSubcommand((sub) => sub.setName('prefix').setDescription(`List Prefix Commands (${prefix})`))
    .addSubcommand((sub) => sub.setName('slash').setDescription('List Slash Commands (/)'))
    .addSubcommand((sub) => sub.setName('menu').setDescription('List Slash Commands by select menu')),
  category: 'help',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
