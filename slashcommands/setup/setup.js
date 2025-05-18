const serverProfile = require('../../config/serverProfile');
const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('setup')
    .setDescription(`Setup thông tin server. ${cfg.adminRole} only`)
    .addSubcommand((sub) => sub.setName('info').setDescription(`Show all setup info. ${cfg.adminRole} only`))
    .addSubcommand((sub) =>
      sub
        .setName('suggest')
        .setDescription(`Setup Suggest Channel. ${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt.setName('schannel').setDescription('Select channel to send suggestions').setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('welcome')
        .setDescription('Setup Welcome Channel and Log Channel')
        .addChannelOption((opt) => opt.setName('welcome').setDescription('Welcome Channel').setRequired(true))
        .addChannelOption((opt) => opt.setName('log').setDescription('Log Channel').setRequired(true))
        .addStringOption((opt) => opt.setName('message').setDescription(`Welcome message's content`)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('youtube')
        .setDescription('Add/Remove youtube channel')
        .addStringOption((opt) => opt.setName('channel-id').setDescription('Youtube Channel ID').setRequired(true))
        .addStringOption((opt) =>
          opt
            .setName('action')
            .setDescription('Add or Remove channel')
            .setRequired(true)
            .addChoices({ name: 'Add', value: 'add' }, { name: 'Remove', value: 'remove' }),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('starboard')
        .setDescription(`Starboard System`)
        .addChannelOption((opt) =>
          opt.setName('starboard-channel').setDescription('Select Starboard Channel').setRequired(true),
        )
        .addIntegerOption((opt) => opt.setName('starnum').setDescription('Number of star').setRequired(true)),
    ),
  category: 'setup',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
