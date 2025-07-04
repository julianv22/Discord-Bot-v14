const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('setup')
    .setDescription(`Configures various server settings. (${cfg.adminRole} only)`)
    .addSubcommand((sub) =>
      sub.setName('info').setDescription(`Displays all current server setup information. (${cfg.adminRole} only)`)
    )
    .addSubcommand((sub) =>
      sub
        .setName('suggest')
        .setDescription(`Sets up the suggestion channel. (${cfg.adminRole} only)`)
        .addChannelOption((opt) =>
          opt.setName('suggest-channel').setDescription('The channel where suggestions will be sent.').setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('welcome')
        .setDescription(`Sets up welcome and log channels. (${cfg.adminRole} only)`)
        .addChannelOption((opt) => opt.setName('welcome').setDescription('The welcome channel.').setRequired(true))
        .addChannelOption((opt) => opt.setName('log').setDescription('The log channel.').setRequired(true))
        .addStringOption((opt) => opt.setName('message').setDescription('The content of the welcome message.'))
    )
    .addSubcommand((sub) =>
      sub
        .setName('starboard')
        .setDescription(`Sets up the starboard system. (${cfg.adminRole} only)`)
        .addChannelOption((opt) =>
          opt.setName('starboard-channel').setDescription('The channel for starboard messages.').setRequired(true)
        )
        .addIntegerOption((opt) =>
          opt
            .setName('starnum')
            .setDescription('The number of stars required for a message to appear on the starboard (1-20).')
            .setMinValue(1)
            .setMaxValue(20)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName('disable').setDescription(`Disables specific server features. (${cfg.adminRole} only)`)
    )
    .addSubcommand((sub) =>
      sub
        .setName('statistics')
        .setDescription(`Sets up server statistics channels. (${cfg.adminRole} only)`)
        .addChannelOption((opt) =>
          opt.setName('total-count-channel').setDescription('Channel to display total member count.').setRequired(true)
        )
        .addChannelOption((opt) =>
          opt.setName('member-count-channel').setDescription('Channel to display human member count.').setRequired(true)
        )
        .addChannelOption((opt) =>
          opt.setName('bot-count-channel').setDescription('Channel to display bot count.').setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName('presence-count-channel')
            .setDescription('Channel to display online presence count.')
            .setRequired(true)
        )
    ),
  /** - Configures various server settings
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {},
};
