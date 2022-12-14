const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { ContextMenuCommandBuilder, EmbedBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder().setName(`Get Info`).setType(ApplicationCommandType.User),
  category: 'context menu',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, targetUser, user } = interaction;
    client.userInfo(guild, targetUser, user, interaction);
  },
};
