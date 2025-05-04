const { Client, Interaction } = require("discord.js");

module.exports = {
  data: { name: "paper-btn" },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    client.rpsGame(2, interaction);
  },
};
