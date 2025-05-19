const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('reload')
    .setDescription(`Reload all commands/events ${cfg.adminRole} only`)
    .addSubcommand((sub) => sub.setName('commands').setDescription(`Reload all commands ${cfg.adminRole} only`))
    .addSubcommand((sub) => sub.setName('events').setDescription(`Reload all events ${cfg.adminRole} only`))
    .addSubcommand((sub) => sub.setName('functions').setDescription(`Reload all functions ${cfg.adminRole} only`)),
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  // ownerOnly: true,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { loadCommands, loadComponents, loadEvents, loadFunctions } = client;
    const { options } = interaction;
    const embed = new EmbedBuilder().setColor('Green');

    try {
      switch (options.getSubcommand()) {
        case 'commands':
          await loadCommands(true);
          await loadComponents();
          await interaction.reply({
            embeds: [embed.setDescription(`\\✅ | Reloading commands, please wait...`)],
            ephemeral: true,
          });
          break;

        case 'events':
          await loadEvents();
          await interaction.reply({
            embeds: [embed.setDescription(`\\✅ | Reloading events, please wait...`)],
            ephemeral: true,
          });
          break;

        case 'functions':
          await loadFunctions();
          await interaction.reply({
            embeds: [embed.setDescription(`\\✅ | Reloading functions, please wait...`)],
            ephemeral: true,
          });
          break;
      }

      setTimeout(() => {
        interaction.editReply({
          embeds: [embed.setDescription(`\\✅ | Successfully reloaded application ${options.getSubcommand()}!`)],
          ephemeral: true,
        });
      }, 2500);
    } catch (e) {
      console.error(chalk.yellow.bold('Error (/reload):', e));
      return interaction.reply(errorEmbed(true, 'Reload command error:', e));
    }
  },
};
