const { SlashCommandBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something 🗣')
    .addStringOption((opt) => opt.setName('text').setDescription('Text for the bot to say'))
    .addUserOption((opt) => opt.setName('hello').setDescription('Say "Hello" to someone')),
  category: 'misc',
  scooldown: 0,
  /**
   * Make the bot say something
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
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
      if (!toSay) return await interaction.reply(errorEmbed(true, 'You must provide some text for the bot to say!'));

      await interaction.reply(toSay);
    }
  },
};
