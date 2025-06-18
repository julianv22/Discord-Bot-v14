const { ChatInputCommandInteraction, Client, SlashCommandBuilder, User } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription("Get user's infomations (personal info, avatar)")
    .addSubcommand((sub) =>
      sub
        .setName('info')
        .setDescription("Get user's info")
        .addUserOption((opt) => opt.setName('target').setDescription('Provide user you wanna get info')),
    )
    .addSubcommand((sub) =>
      sub
        .setName('avatar')
        .setDescription("Get user's avatar")
        .addUserOption((opt) => opt.setName('target').setDescription('Provide user you wanna get avatar')),
    ),
  /**
   * User commands
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
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

    if (!showInfo[subCommand]) throw new Error(`Invalid SubCommand ${chalk.green(subCommand)}`);
    else await (showInfo[subCommand] || showInfo.default)();
  },
};
