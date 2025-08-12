const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'tournament-menu' },
  /** Setup Tournament
   * @param {Interaction} interaction Select Menu Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    await interaction.deferUpdate();

    const { guild, guildId, message, values } = interaction;
    const { components } = message;
    const { roles } = guild;
    const tourName = components[0].components[0].components[1].data;
    const getRole = (roleId) => roles.cache.get(roleId) || '*\u274C\uFE0F Chưa có giải nào*';
    const profile = await serverProfile.findOne({ guildId }).catch(console.error);
    const { tournament } = profile || {};

    tournament.roleId = values[0];
    tournament.roleName = getRole(values[0]).name;
    tourName.content = `- Tournament name: ${getRole(values[0])}`;

    await profile.save().catch(console.error);
    await interaction.editReply({ components });
  },
};
