const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something 🗣')
    .addStringOption((opt) => opt.setName('content').setDescription('Content for the bot to say'))
    .addUserOption((opt) => opt.setName('user').setDescription('Say "Hello" to user')),
  /** - Make the bot say something
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { options } = interaction;
    const { errorEmbed } = client;
    const content = options.getString('content');
    const target = options.getUser('user');

    if (target) {
      if (!content) {
        await interaction.reply(`Hello ${target} 👋!`);
        setTimeout(async () => {
          return await interaction.followUp('Have a good day 🎉!');
        }, 3000);
      } else await interaction.reply(`${target}: ${content}`);
    } else {
      if (!content)
        return await interaction.reply(errorEmbed({ desc: 'You must provide some text for the bot to say!' }));
      else await interaction.reply(content);
    }
  },
};
