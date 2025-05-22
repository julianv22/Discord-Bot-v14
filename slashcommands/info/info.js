const { SlashCommandBuilder, Client, Interaction } = require('discord.js');
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
  /**
   * Show bot or server or user's info
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {},
};
