const serverProfile = require('../../config/serverProfile');
const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('setup')
    .setDescription(`Set up server information. ${cfg.adminRole} only`)
    .addSubcommand((sub) => sub.setName('info').setDescription(`Show all setup information. ${cfg.adminRole} only`))
    .addSubcommand((sub) =>
      sub
        .setName('suggest')
        .setDescription(`Set up suggestion channel. ${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt.setName('schannel').setDescription('Select the channel to send suggestions to').setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('welcome')
        .setDescription(`Set up welcome and log channels. ${cfg.adminRole} only`)
        .addChannelOption((opt) => opt.setName('welcome').setDescription('Welcome channel').setRequired(true))
        .addChannelOption((opt) => opt.setName('log').setDescription('Log channel').setRequired(true))
        .addStringOption((opt) => opt.setName('message').setDescription('Welcome message content')),
    )
    .addSubcommand((sub) =>
      sub
        .setName('youtube')
        .setDescription(`Add or remove a YouTube channel. ${cfg.adminRole} only`)
        .addStringOption((opt) => opt.setName('channel-id').setDescription('YouTube channel ID').setRequired(true))
        .addStringOption((opt) =>
          opt
            .setName('action')
            .setDescription('Add or remove channel')
            .setRequired(true)
            .addChoices({ name: 'Add', value: 'add' }, { name: 'Remove', value: 'remove' }),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('starboard')
        .setDescription(`Set up starboard system. ${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt.setName('starboard-channel').setDescription('Select the starboard channel').setRequired(true),
        )
        .addIntegerOption((opt) =>
          opt.setName('starnum').setDescription('Number of stars').setMinValue(1).setMaxValue(20).setRequired(true),
        ),
    )
    .addSubcommand((sub) => sub.setName('disable').setDescription(`Disable server features. ${cfg.adminRole} only`)),
  category: 'setup',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  /**
   * Setup server
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {},
};
