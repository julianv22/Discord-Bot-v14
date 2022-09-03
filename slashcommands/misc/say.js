const { SlashCommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Bot say something')
    .addSubcommand(sub =>
      sub
        .setName('smth')
        .setDescription('Make bot say some thing')
        .addStringOption(opt => opt.setName('content').setDescription('Content').setRequired(true))
    )
    .addSubcommand(sub =>
      sub
        .setName('hello')
        .setDescription('Say hello to someone')
        .addUserOption(opt => opt.setName('user').setDescription('Provide user you  would like to say hello'))
    ),
  category: 'misc',
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   */
  async execute(interaction, client) {
    const { options } = interaction;
    switch (options.getSubcommand()) {
      case 'smth':
        interaction.reply(interaction.options.getString('content'));

        break;

      case 'hello':
        const user = options.getUser('user') || interaction.user;
        await interaction.reply(`Hello ${user}!`);
        setTimeout(() => {
          interaction.followUp('Have a good day!');
        }, 3000);

        break;
    }
  },
};
