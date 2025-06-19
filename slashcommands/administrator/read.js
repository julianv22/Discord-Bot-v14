const { ChatInputCommandInteraction, Client, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { readFiles } = require('../../functions/common/initLoader');
const profiles = readFiles('config', { filter: (file) => file.endsWith('Profile.js') });

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('read')
    .setDescription(`Read JavaScript file content/MongoDB database/Command Collection. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('file')
        .setDescription('Read JavaScript file content')
        .addStringOption((option) =>
          option
            .setName('filepath')
            .setDescription('JavaScript file relative file path (ex: ./commands/ping.js)')
            .setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('database')
        .setDescription('Read database from MongoDB (⭕wner only)')
        .addStringOption((opt) =>
          opt
            .setName('profile')
            .setDescription('Choose which profile type to query')
            .setRequired(true)
            .addChoices(profiles.map((p) => ({ name: p.split('.')[0], value: p.split('.')[0] })))
            .addChoices({ name: 'reactionRole', value: 'reactionRole' }),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('commands')
        .setDescription('Read all commands data from server')
        .addStringOption((opt) =>
          opt
            .setName('command')
            .setDescription('Choose command')
            .setRequired(true)
            .addChoices([
              { name: 'Slash Commands', value: 'slashcommands' },
              { name: 'Sub Commands', value: 'subcommands' },
              { name: 'Prefix Commands', value: 'prefixcommands' },
            ]),
        ),
    ),
  /** - Read file content/MongoDB/Command Collection
   * @param {ChatInputCommandInteraction} interaction Interaction
   * @param {Client} client Client */
  async execute(interaction, client) {},
};
