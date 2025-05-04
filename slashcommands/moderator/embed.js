const {
  SlashCommandBuilder,
  Interaction,
  Client,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName("embed")
    .setDescription(`Edit/Create Embed. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName("editor")
        .setDescription("Edit Embed Message" + `${cfg.adminRole} only`)
    )
    .addSubcommand((sub) =>
      sub
        .setName("creator")
        .setDescription("Create Embed Message. " + `${cfg.modRole} only`)
    ),
  category: "moderator",
  permissions: PermissionFlagsBits.ManageMessages,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
