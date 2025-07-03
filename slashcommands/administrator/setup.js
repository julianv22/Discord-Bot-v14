const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('setup')
    .setDescription(`Set up server's information. ${cfg.adminRole} only`)
    .addSubcommand((sub) => sub.setName('info').setDescription(`Show all setup information. ${cfg.adminRole} only`))
    .addSubcommand((sub) =>
      sub
        .setName('suggest')
        .setDescription(`Set up suggestion channel. ${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt.setName('suggest-channel').setDescription('Select the channel to send suggestions to').setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('welcome')
        .setDescription(`Set up welcome and log channels. ${cfg.adminRole} only`)
        .addChannelOption((opt) => opt.setName('welcome').setDescription('Welcome channel').setRequired(true))
        .addChannelOption((opt) => opt.setName('log').setDescription('Log channel').setRequired(true))
        .addStringOption((opt) => opt.setName('message').setDescription('Welcome message content'))
    )
    .addSubcommand((sub) =>
      sub
        .setName('starboard')
        .setDescription(`Set up starboard system. ${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt.setName('starboard-channel').setDescription('Select the starboard channel').setRequired(true)
        )
        .addIntegerOption((opt) =>
          opt.setName('starnum').setDescription('Number of stars').setMinValue(1).setMaxValue(20).setRequired(true)
        )
    )
    .addSubcommand((sub) => sub.setName('disable').setDescription(`Disable server features. ${cfg.adminRole} only`))
    .addSubcommand((sub) =>
      sub
        .setName('statistics')
        .setDescription(`Setup server statistics. ${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt.setName('total-count-channel').setDescription('Total Count Channel').setRequired(true)
        )
        .addChannelOption((opt) =>
          opt.setName('member-count-channel').setDescription('Members Count Channel').setRequired(true)
        )
        .addChannelOption((opt) =>
          opt.setName('bot-count-channel').setDescription('Bots Count Channel').setRequired(true)
        )
        .addChannelOption((opt) =>
          opt.setName('presence-count-channel').setDescription('Presences Count Channel').setRequired(true)
        )
    ),
  /** - Setup server
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {},
};
