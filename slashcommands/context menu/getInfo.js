const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { ContextMenuCommandBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');
module.exports = {
  data: new ContextMenuCommandBuilder().setName(`Get Info`).setType(ApplicationCommandType.User),
  category: 'context menu',
  scooldown: 0,
  /**
   * Get user information
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, targetUser, user } = interaction;
    client.userInfo(guild, targetUser, user, interaction);
  },
};
