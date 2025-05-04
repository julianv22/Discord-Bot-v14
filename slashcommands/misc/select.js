const {
  SlashCommandBuilder,
  SelectMenuBuilder,
  ActionRowBuilder,
  SelectMenuOptionBuilder,
  Client,
  Interaction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("select")
    .setDescription("Select Color")
    .addSubcommand((sub) =>
      sub.setName("color").setDescription("Select Color")
    ),
  category: "misc",
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const menu = new SelectMenuBuilder()
      .setCustomId("color-mn")
      .setMinValues(1)
      .setMaxValues(1)
      .setOptions(
        new SelectMenuOptionBuilder().setLabel("Random").setValue("Random"),
        new SelectMenuOptionBuilder().setLabel(`Aqua`).setValue("Aqua"),
        new SelectMenuOptionBuilder().setLabel(`Blue`).setValue("Blue"),
        new SelectMenuOptionBuilder().setLabel(`Gold`).setValue("Gold"),
        new SelectMenuOptionBuilder()
          .setLabel(`DarkVividPink`)
          .setValue("DarkVividPink"),
        new SelectMenuOptionBuilder().setLabel(`Green`).setValue("Green"),
        new SelectMenuOptionBuilder()
          .setLabel(`LuminousVividPink`)
          .setValue("LuminousVividPink"),
        new SelectMenuOptionBuilder().setLabel(`Orange`).setValue("Orange"),
        new SelectMenuOptionBuilder().setLabel(`Purple`).setValue("Purple"),
        new SelectMenuOptionBuilder().setLabel(`White`).setValue("White"),
        new SelectMenuOptionBuilder().setLabel(`Yellow`).setValue("Yellow")
      );

    interaction.reply({
      content: "Select Color:",
      components: [new ActionRowBuilder().addComponents(menu)],
    });
  },
};
