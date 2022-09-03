const { Client, Interaction } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { menus, executeInteraction } = client;
    const { member, customId } = interaction;

    if (interaction.isSelectMenu()) {
      const menu = menus.get(customId);

      if (menu.permissions && !member.permissions.has(menu.permissions))
        return interaction.reply({
          embeds: [{ color: 16711680, description: `\\❌ | You do not have permission to do this command!` }],
          ephemeral: true,
        });

      if (menu) executeInteraction(menu, interaction);
    }
  },
};
