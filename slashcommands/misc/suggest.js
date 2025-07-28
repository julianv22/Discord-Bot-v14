const { Client, Interaction, SlashCommandBuilder, TextInputStyle } = require('discord.js');
const { createModal } = require('../../functions/common/components');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('suggest').setDescription('Send your suggestions for this server'),
  /** - Send suggestions to this server
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await createModal(interaction, 'suggest', 'Server Suggestion', {
      customId: 'content',
      label: 'Suggestion Content',
      style: TextInputStyle.Paragraph,
      required: true,
    });
  },
};
