const serverProfile = require('../../config/serverProfile');
const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('setup')
    .setDescription(`Setup thông tin server. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('suggest-channel')
        .setDescription(`Setup Suggest Channel. ${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt.setName('schannel').setDescription('Select channel to send suggestions').setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('welcome-channel')
        .setDescription(`Setup Welcome Channel and Log Channel. ${cfg.adminRole} only`)
        .addChannelOption((opt) => opt.setName('welcome').setDescription('Welcome Channel').setRequired(true))
        .addChannelOption((opt) => opt.setName('log').setDescription('Log Channel').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('welcome-message')
        .setDescription('Setup Welcome message. ' + `${cfg.adminRole} only`)
        .addStringOption((opt) => opt.setName('message').setDescription(`Welcome message's content`)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('youtube')
        .setDescription('Add/Remove youtube channel. ' + `${cfg.adminRole} only`)
        .addStringOption((opt) => opt.setName('yt-channel-id').setDescription('Youtube Channel ID').setRequired(true))
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
        .setName('yt-notify')
        .setDescription('Set notify channel for Youtube. ' + `${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt.setName('notify-channel').setDescription('Choose channel to notify').setRequired(true),
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
  category: 'moderator',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
