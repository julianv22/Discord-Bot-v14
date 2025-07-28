const { Client, Interaction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something')
    .addStringOption((opt) => opt.setName('content').setDescription('The content for the bot to say'))
    .addUserOption((opt) => opt.setName('user').setDescription('Mention a user to say "Hello" to')),
  /** - Make the bot say something
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { options } = interaction;
    const { messageEmbed } = client;
    const content = options.getString('content');
    const target = options.getUser('user');

    if (!content && !target)
      return await interaction.reply(messageEmbed({ desc: 'Bạn phải cung cấp nội dung để bot nói!' }));

    await interaction.deferReply();

    if (target) {
      if (content) return await interaction.editReply(`${target}: ${content}`);

      await interaction.editReply(`Hello ${target} 👋!`);

      return setTimeout(async () => await interaction.followUp('Have a good day 🎉!'), 3 * 1000);
    }

    await interaction.editReply(content);
  },
};
