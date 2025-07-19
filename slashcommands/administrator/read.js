const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { readFiles } = require('../../functions/common/initLoader');
const profiles = readFiles('config', { filter: (file) => file.endsWith('Profile.js') });

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('read')
    .setDescription(`Reads content from JavaScript files, MongoDB, or project structure. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('file')
        .setDescription(`Reads the content of a JavaScript file. ${cfg.adminRole} only`)
        .addStringOption((option) =>
          option
            .setName('filepath')
            .setDescription('The relative path to the JavaScript file (e.g., ./commands/ping.js).')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('database')
        .setDescription('Reads data from a MongoDB database. ⭕wner only')
        .addStringOption((opt) =>
          opt
            .setName('profile')
            .setDescription(`Choose which profile type to query from the database. ${cfg.adminRole} only`)
            .setRequired(true)
            .addChoices(profiles.map((p) => ({ name: p.split('.')[0], value: p.split('.')[0] })))
            .addChoices({ name: 'reactionRole', value: 'reactionRole' })
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('structure')
        .setDescription(`Reads the project structure from a specified path. ${cfg.adminRole} only`)
        .addStringOption((opt) => opt.setName('path').setDescription('The path to read the structure from.'))
    ),
  /** - Reads file content, MongoDB data, or project structure
   * @param {Interaction} interaction Interaction
   * @param {Client} client Client */
  async execute(interaction, client) {},
};
