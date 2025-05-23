const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('reload')
    .setDescription(`Reload all commands and events. ${cfg.adminRole} only`)
    .addSubcommand((sub) => sub.setName('commands').setDescription(`Reload all commands. ${cfg.adminRole} only`))
    .addSubcommand((sub) => sub.setName('events').setDescription(`Reload all events. ${cfg.adminRole} only`))
    .addSubcommand((sub) => sub.setName('functions').setDescription(`Reload all functions. ${cfg.adminRole} only`)),
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  // ownerOnly: true,
  /**
   * Reload all commands and events
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { loadCommands, loadComponents, loadEvents, loadFunctions } = client;
    const { options } = interaction;
    const embed = new EmbedBuilder().setColor('Green');

    try {
      const CommandsType = {
        commands: async () => {
          await loadCommands(true);
          await loadComponents();
          await interaction.reply({
            embeds: [embed.setDescription(`\\✅ | Reloading commands, please wait...`)],
            ephemeral: true,
          });
        },
        events: async () => {
          await loadEvents();
          await interaction.reply({
            embeds: [embed.setDescription(`\\✅ | Reloading events, please wait...`)],
            ephemeral: true,
          });
        },
        functions: async () => {
          await loadFunctions();
          await interaction.reply({
            embeds: [embed.setDescription(`\\✅ | Reloading functions, please wait...`)],
            ephemeral: true,
          });
        },
      };
      if (typeof CommandsType[options.getSubcommand()] === 'function') await CommandsType[options.getSubcommand()]();

      setTimeout(async () => {
        await interaction.editReply({
          embeds: [embed.setDescription(`\\✅ | Successfully reloaded application ${options.getSubcommand()}!`)],
          ephemeral: true,
        });
      }, 2500);
    } catch (e) {
      console.error(chalk.red('Error (/reload):', e));
      return await interaction.reply(errorEmbed(true, 'Reload command error:', e));
    }
  },
};
