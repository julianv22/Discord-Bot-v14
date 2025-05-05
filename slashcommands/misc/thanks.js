const { SlashCommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('thanks')
    .setDescription('Thanks someone')
    .addUserOption((opt) =>
      opt.setName('user').setDescription(`Provide someone you would like to thank`).setRequired(true),
    ),
  category: 'misc',
  scooldown: 30,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    client.thanksUser(interaction.options.getUser('user'), interaction.user, interaction);
  },
};
