const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Prefix Commands List')
    .addSubcommand(sub => sub.setName('prefix').setDescription(`Prefix Commands (${prefix}) List`))
    .addSubcommand(sub => sub.setName('slash').setDescription('Slash Commands (/) List')),
  category: 'help',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
