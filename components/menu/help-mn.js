const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: { name: 'help-mn' },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user, values } = interaction;
    const { slashCommands, subCommands } = client;
    const select = values[0];

    let embed;
    if (select !== 'subcommands') {
      const commands = Array.from(slashCommands.values())
        .filter((cmd) => cmd.category && cmd.category.toLowerCase() === select.toLowerCase())
        .map((cmd) => ({
          name: cmd.data?.name || cmd.name,
          description: cmd.data?.description || 'No description',
        }));

      embed = new EmbedBuilder()
        .setTitle(`\\📂 ${select.toUpperCase()} Commands [${commands.length}]:`)
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setColor('Random')
        .addFields(
          commands.length
            ? commands.map((cmd) => ({
                name: `/${cmd.name}`,
                value: `\`\`\`fix\n${cmd.description}\`\`\``,
              }))
            : [{ name: 'No commands found in this category.', value: '\u200b' }],
        )
        .setFooter({ text: `Requested by ${user.displayName}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp();
    } else {
      // Gom các subcommand theo parent
      const parentMap = {};
      let total = 0;
      for (const cmd of subCommands.values()) {
        const parent = cmd.parent || 'N/A';
        const name = cmd.data?.name || cmd.name;
        if (!parentMap[parent]) parentMap[parent] = [];
        parentMap[parent].push(name);
        total++;
      }

      const fields = Object.entries(parentMap).map(([parent, subs]) => ({
        name: `/${parent}`,
        value: `\`\`\`fix\n${subs.join(' | ')}\`\`\``,
      }));

      embed = new EmbedBuilder()
        .setTitle(`\\📂 SUBCOMMANDS [${total}]:`)
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setColor('Random')
        .addFields(fields.length ? fields : [{ name: 'No subcommands found.', value: '\u200b' }])
        .setFooter({ text: `Requested by ${user.displayName}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp();
    }

    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: true });
    }
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  },
};
