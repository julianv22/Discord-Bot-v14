const { Client, Interaction } = require("discord.js");

module.exports = {
  data: { name: "djs-support-btn" },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    await interaction.reply({
      content:
        `Tham gia \`${cfg.supportServer}\` để được hỗ trợ!\n` + cfg.supportLink,
      ephemeral: true,
    });
  },
};
