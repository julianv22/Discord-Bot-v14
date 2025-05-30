const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
module.exports = {
  category: 'moderator',
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
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { loadCommands, loadComponents, loadEvents, loadFunctions, errorEmbed } = client;
    const { options } = interaction;
    const embed = new EmbedBuilder().setColor('Green');

    try {
      const CommandsType = {
        commands: async () => {
          await loadCommands(true);
          await loadComponents();
          await interaction.reply({
            embeds: [embed.setDescription(`\\✅ | Reloading commands, please wait...`)],
            flags: 64,
          });
        },
        events: async () => {
          await loadEvents();
          await interaction.reply({
            embeds: [embed.setDescription(`\\✅ | Reloading events, please wait...`)],
            flags: 64,
          });
        },
        functions: async () => {
          await loadFunctions();
          await interaction.reply({
            embeds: [embed.setDescription(`\\✅ | Reloading functions, please wait...`)],
            flags: 64,
          });
        },
      };
      if (typeof CommandsType[options.getSubcommand()] === 'function') await CommandsType[options.getSubcommand()]();

      setTimeout(async () => {
        await interaction.editReply(
          errorEmbed({ description: `Successfully reloaded application ${options.getSubcommand()}!`, emoji: true }),
        );
      }, 2500);
    } catch (e) {
      console.error(chalk.red('Error while executing /reload command', e));
      return await interaction.reply(
        errorEmbed({ title: `\\❌ | Error while executing /reload command`, description: e, color: 'Red' }),
      );
    }
  },
};
