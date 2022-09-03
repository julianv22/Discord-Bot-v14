const { Client, Interaction } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { buttons, executeInteraction } = client;
    const { member, customId } = interaction;

    if (!interaction.isButton()) return;
    const button = buttons.get(customId);

    if (button.permissions && !member.permissions.has(button.permissions))
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | You do not have permission to do this command!` }],
        ephemeral: true,
      });

    if (button) executeInteraction(button, interaction);
  },
};
