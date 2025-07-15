const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('reload')
    .setDescription(`Reloads all commands, events, and functions. (${cfg.adminRole} only)`)
    .addSubcommand((sub) => sub.setName('commands').setDescription(`Reloads all commands. (${cfg.adminRole} only)`))
    .addSubcommand((sub) => sub.setName('events').setDescription(`Reloads all events. (${cfg.adminRole} only)`))
    .addSubcommand((sub) => sub.setName('functions').setDescription(`Reloads all functions. (${cfg.adminRole} only)`)),
  // ownerOnly: true,
  /** - Reloads all commands, events, and functions
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { options } = interaction;
    const { loadCommands, loadComponents, loadEvents, loadFunctions, errorEmbed } = client;
    const subCommand = options.getSubcommand();

    const reload = {
      commands: async () => {
        await loadCommands();
        await loadComponents();
        return true;
      },
      events: async () => {
        await loadEvents(true);
        return true;
      },
      functions: async () => {
        await loadFunctions(true);
        return true;
      },
    };

    if (!reload[subCommand]())
      return await interaction.reply(errorEmbed({ desc: `Invalid subCommand ${subCommand}!` }));

    await interaction.reply(errorEmbed({ desc: `Reloading ${subCommand}... Please wait.`, emoji: true }));

    setTimeout(async () => {
      await interaction.editReply(errorEmbed({ desc: `Successfully reloaded ${subCommand}!`, emoji: true }));
    }, 2500);
  },
};
