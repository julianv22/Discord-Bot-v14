const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { ContextMenuCommandBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');
module.exports = {
  data: new ContextMenuCommandBuilder().setName(`Get Info`).setType(ApplicationCommandType.User),
  category: 'context menu',
  scooldown: 0,
  /**
   * Lấy thông tin user
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const { guild, targetUser, user } = interaction;
    client.userInfo(guild, targetUser, user, interaction);
  },
};
