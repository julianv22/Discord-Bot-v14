const {
  SlashCommandSubcommandBuilder,
  Client,
  Interaction,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require('discord.js');
const { readdirSync } = require('fs');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('menu'),
  category: 'sub command',
  parent: 'help',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const folders = readdirSync('./slashcommands').filter((f) => f !== 'context menu' && !f.endsWith('.js'));
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`help-mn:${folders}`)
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(folders.map((f) => ({ label: `\📂 ${f.toUpperCase()}`, value: f })));

    await interaction.reply({
      content: '**Select command category \\📂:**',
      components: [new ActionRowBuilder().addComponents(menu)],
      ephemeral: true,
    });
  },
};
