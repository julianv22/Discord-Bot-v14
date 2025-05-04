const serverProfile = require("../../config/serverProfile");
const {
  SlashCommandBuilder,
  Client,
  Interaction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName("setup")
    .setDescription(`Setup thông tin server. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName("suggest-channel")
        .setDescription(`Setup Suggest Channel. ${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt
            .setName("schannel")
            .setDescription("Select channel to send suggestions")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("welcome-channel")
        .setDescription(
          `Setup Welcome Channel and Log Channel. ${cfg.adminRole} only`
        )
        .addChannelOption((opt) =>
          opt
            .setName("welcome")
            .setDescription("Welcome Channel")
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt.setName("log").setDescription("Log Channel").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("welcome-message")
        .setDescription("Setup Welcome message. " + `${cfg.adminRole} only`)
        .addStringOption((opt) =>
          opt.setName("message").setDescription(`Welcome message's content`)
        )
    ),
  category: "moderator",
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
