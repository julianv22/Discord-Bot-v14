const { EmbedBuilder, PermissionFlagsBits, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: { name: 'help-mn' },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const {
      guild,
      user,
      member: { permissions },
      customId,
      values,
    } = interaction;
    const { slashCommands, subCommands } = client;
    const [prefix, folders] = customId.split(':');

    const select = values[0];
    const isAdmin = permissions.has(PermissionFlagsBits.Administrator);

    let embed;
    if (select !== 'subcommands') {
      let commands = Array.from(slashCommands.values()).filter(
        (cmd) => cmd.category && cmd.category.toLowerCase() === select.toLowerCase(),
      );

      if (!isAdmin) {
        commands = commands.filter((cmd) => !cmd.permissions);
      }

      const cmds = commands.map((c) => ({
        name: c.data?.name || c.name,
        description: c.data?.description || 'No description',
      }));

      embed = new EmbedBuilder()
        .setTitle(`\\📂 ${select.toUpperCase()} Commands [${commands.length}]:`)
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setColor('Random')
        .addFields(
          cmds.length
            ? cmds.map((cmd) => ({
                name: `/${cmd.name}`,
                value: `\`\`\`fix\n${cmd.description}\`\`\``,
              }))
            : [
                {
                  name: '❌ No commands found in this category or you do not have enough permissions.',
                  value: '\u200b',
                },
              ],
        )
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
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
        .addFields(
          fields.length
            ? fields
            : [{ name: '❌ No subcommands found or you do not have enough permissions.', value: '\u200b' }],
        )
        .addFields({ name: '\u200b', value: '**Note:** *Some commands require proper permissions❗*' })
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp();
    }

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`help-mn:${folders}`)
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(folders.split(',').map((f) => ({ label: `\📂 ${f.toUpperCase()}`, value: f })));

    return interaction.update({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)],
      ephemeral: true,
    });
  },
};
