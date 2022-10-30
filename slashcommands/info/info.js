const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription(`Server/Member's Info`)
    .addUserOption(opt => opt.setName('user').setDescription(`Member's Info`)),
  category: 'info',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user: author, options } = interaction;
    const user = options.getUser('user');

    if (user) client.userInfo(guild, user, author, interaction);
    else client.serverInfo(guild, author, interaction);
  },
};
