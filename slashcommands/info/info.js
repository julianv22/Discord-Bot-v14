const { SlashCommandBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription(`Get informations of bot/server/user`)
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
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { botInfo, serverInfo, userInfo } = client;
    const { guild, user, options } = interaction;
    const subCommand = options.getSubcommand();
    const showInfo = {
      bot: () => botInfo(user, interaction),
      server: () => serverInfo(guild, user, interaction),
      user: () => userInfo(guild, options.getUser('user'), user, interaction),
    };
    if (typeof showInfo[subCommand] === 'function') await showInfo[subCommand]();
  },
};
