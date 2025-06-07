const { SlashCommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something 🗣')
    .addStringOption((opt) => opt.setName('text').setDescription('Text for the bot to say'))
    .addUserOption((opt) => opt.setName('hello').setDescription('Say "Hello" to someone')),
  /**
   * Make the bot say something
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const { errorEmbed } = client;
    const toSay = options.getString('text');
    const target = options.getUser('hello');

    if (target) {
      await interaction.reply(`Hello ${target}!`);
      setTimeout(async () => {
        return await interaction.followUp('Have a good day!');
      }, 3000);
    } else {
      if (!toSay)
        return await interaction.reply(
          errorEmbed({ description: 'You must provide some text for the bot to say!', emoji: false }),
        );

      return await interaction.reply(toSay);
    }
  },
};
