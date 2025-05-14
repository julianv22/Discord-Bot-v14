const { SlashCommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Bot say 🗣')
    .addStringOption((opt) => opt.setName('text').setDescription('Make bot say something'))
    .addUserOption((opt) => opt.setName('hello').setDescription('Say "Hello" to someone')),
  category: 'misc',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options } = interaction;

    const toSay = options.getString('text');
    const target = options.getUser('hello');

    if (target) {
      await interaction.reply(`Hello ${target}!`);
      setTimeout(() => {
        interaction.followUp('Have a good day!');
      }, 3000);
    } else {
      if (!toSay) return await interaction.reply(errorEmbed(true, 'You have to provide some text for bot!'));

      await interaction.reply(toSay);
    }
  },
};
