const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription(`Get informations of...`)
    .addSubcommand((sub) => sub.setName('bot').setDescription(`Get bot's info`))
    .addSubcommand((sub) => sub.setName('server').setDescription(`Get server's info`))
    .addSubcommand((sub) =>
      sub
        .setName('user')
        .setDescription(`Get user's info`)
        .addUserOption((opt) => opt.setName('user').setDescription(`Select user`).setRequired(true)),
    ),
  category: 'info',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
