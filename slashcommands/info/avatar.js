const { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get Avatar')
    .addUserOption((opt) => opt.setName('user').setDescription('Provide user you wanna show Avatar')),
  /**
   * Show user's avatar
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { user, options } = interaction;
    const { getAvatar } = client;
    const target = options.getUser('user') || user;

    await getAvatar(target, interaction);
  },
};
