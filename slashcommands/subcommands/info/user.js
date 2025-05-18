const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('user'),
  category: 'sub command',
  parent: 'info',
  scooldown: 0,

  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const targetUser = options.getUser('user');

    if (targetUser) client.userInfo(guild, targetUser, user, interaction);
  },
};
