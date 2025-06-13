const {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
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
    .setDescription(`Reload all commands and events. ${cfg.adminRole} only`)
    .addSubcommand((sub) => sub.setName('commands').setDescription(`Reload all commands. ${cfg.adminRole} only`))
    .addSubcommand((sub) => sub.setName('events').setDescription(`Reload all events. ${cfg.adminRole} only`))
    .addSubcommand((sub) => sub.setName('functions').setDescription(`Reload all functions. ${cfg.adminRole} only`)),
  // ownerOnly: true,
  /**
   * Reload all commands and events
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const { loadCommands, loadComponents, loadEvents, loadFunctions, errorEmbed, catchError } = client;
    const subCommand = options.getSubcommand();
    const embed = new EmbedBuilder().setColor(Colors.Green);

    try {
      const CommandsType = {
        commands: async () => {
          await loadCommands(true);
          await loadComponents();
          await interaction.reply(errorEmbed({ description: 'Reloading commands, please wait...', emoji: true }));
        },
        events: async () => {
          await loadEvents();
          await interaction.reply(errorEmbed({ description: 'Reloading events, please wait...', emoji: true }));
        },
        functions: async () => {
          await loadFunctions();
          await interaction.reply(errorEmbed({ description: 'Reloading functions, please wait...', emoji: true }));
        },
      };

      if (!CommandsType[subCommand]) throw new Error(chalk.yellow('Invalid SubCommand ') + chalk.green(subCommand));

      await CommandsType[subCommand]();

      setTimeout(async () => {
        await interaction.editReply(
          errorEmbed({ description: `Successfully reloaded application ${subCommand}!`, emoji: true }),
        );
      }, 2500);
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
