const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
} = require('discord.js');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('reload')
    .setDescription(`Reload all commands, events and functions. ${cfg.adminRole} only`)
    .addSubcommand((sub) => sub.setName('commands').setDescription(`Reload all commands. ${cfg.adminRole} only`))
    .addSubcommand((sub) => sub.setName('events').setDescription(`Reload all events. ${cfg.adminRole} only`))
    .addSubcommand((sub) => sub.setName('functions').setDescription(`Reload all functions. ${cfg.adminRole} only`)),
  // ownerOnly: true,
  /**
   * Reload all commands and events
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const { loadCommands, loadComponents, loadEvents, loadFunctions, errorEmbed, catchError } = client;
    const subCommand = options.getSubcommand();
    await interaction.deferReply({ flags: 64 });

    try {
      const CommandsType = {
        commands: async () => {
          await loadCommands(true);
          await loadComponents();
        },
        events: async () => await loadEvents(),
        functions: async () => await loadFunctions(),
      };

      if (!CommandsType[subCommand]) throw new Error(chalk.yellow('Invalid SubCommand ') + chalk.green(subCommand));
      else await CommandsType[subCommand]();

      await interaction.editReply(errorEmbed({ desc: `Reloading ${subCommand}, please wait...`, emoji: true }));

      setTimeout(async () => {
        await interaction.editReply(
          errorEmbed({ desc: `Successfully reloaded application ${subCommand}!`, emoji: true }),
        );
      }, 2500);
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
