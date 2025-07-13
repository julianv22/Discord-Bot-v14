const { Client, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription("Get user's information (personal info, avatar)")
    .addSubcommand((sub) =>
      sub
        .setName('info')
        .setDescription("Get user's info")
        .addUserOption((opt) =>
          opt.setName('target').setDescription('Provide the user you want to get information about')
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('avatar')
        .setDescription("Get user's avatar")
        .addUserOption((opt) => opt.setName('target').setDescription('Provide the user you want to get the avatar of'))
    ),
  /** - User information
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client */
  async execute(interaction, client) {
    const { user, options } = interaction;
    const { userInfo, getAvatar } = client;
    const subCommand = options.getSubcommand();
    const target = options.getUser('target') || user;

    const showInfo = {
      info: async () => {
        return await userInfo(target, interaction);
      },
      avatar: async () => {
        return await getAvatar(target, interaction);
      },
    };

    if (!showInfo[subCommand]) throw new Error(chalk.yellow('Invalid SubCommand ') + chalk.green(subCommand));

    await showInfo[subCommand]();
  },
};
