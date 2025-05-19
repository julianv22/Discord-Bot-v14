const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('select')
    .setDescription('Select Color')
    .addSubcommand((sub) => sub.setName('color').setDescription('Select Color')),
  category: 'misc',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('color-mn')
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        { label: 'Random', value: 'Random' },
        { label: 'Aqua', value: 'Aqua' },
        { label: 'Blue', value: 'Blue' },
        { label: 'Gold', value: 'Gold' },
        { label: 'DarkVividPink', value: 'DarkVividPink' },
        { label: 'Green', value: 'Green' },
        { label: 'LuminousVividPink', value: 'LuminousVividPink' },
        { label: 'Orange', value: 'Orange' },
        { label: 'Purple', value: 'Purple' },
        { label: 'White', value: 'White' },
        { label: 'Yellow', value: 'Yellow' },
      );

    await interaction.reply({
      content: 'Select Color:',
      components: [new ActionRowBuilder().addComponents(menu)],
    });
  },
};
