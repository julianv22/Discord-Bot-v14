const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('bot')
    .setDescription("Get bot's informations")
    .addSubcommand((sub) => sub.setName('info').setDescription('Bot info')),
  /**
   * Donate for Julian-V
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const { botInfo } = client;
    const subCommand = options.getSubcommand();

    const showInfo = {
      info: async () => await botInfo(interaction),
    };

    if (!showInfo[subCommand]) throw new Error(`Invalid SubCommand ${chalk.green(subCommand)}`);

    await showInfo[subCommand]();
  },
};
