const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('reload')
    .setDescription(`Reload all commands/events ${cfg.adminRole} only`)
    .addSubcommand(sub => sub.setName('commands').setDescription(`Reload all commands ${cfg.adminRole} only`))
    .addSubcommand(sub => sub.setName('events').setDescription(`Reload all events ${cfg.adminRole} only`)),
  category: 'moderator',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { loadCommands, loadEvents } = client;
    const { options } = interaction;
    const embed = new EmbedBuilder().setColor('Green');

    switch (options.getSubcommand()) {
      case 'commands':
        await loadCommands(true);
        interaction.reply({ embeds: [embed.setDescription(`\\✅ | Reloading commands, pls wait...`)], ephemeral: true });
        break;

      case 'events':
        await loadEvents(true);
        interaction.reply({ embeds: [embed.setDescription(`\\✅ | Reloading events, pls wait...`)], ephemeral: true });
        break;
    }

    setTimeout(() => {
      interaction.editReply({ embeds: [embed.setDescription(`\\✅ | Successfully reloaded application ${options.getSubcommand()}!`)], ephemeral: true });
    }, 2500);
  },
};
