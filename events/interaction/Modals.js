const { Client, Interaction, InteractionType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { modals, executeInteraction } = client;
    const { member, customId, type } = interaction;

    if (type == InteractionType.ModalSubmit) {
      const modal = modals.get(customId);

      if (modal.permissions && !member.permissions.has(modal.permissions))
        return interaction.reply({
          embeds: [{ color: 16711680, description: `\\❌ | You do not have permission to do this command!` }],
          ephemeral: true,
        });

      if (modal) executeInteraction(modal, interaction);
    }
  },
};
