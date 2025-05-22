const { EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'slash-menu' },
  /**
   * Menu slash
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const { slashCommands, subCommands, helpPrefix } = client;
    const { guild, user } = interaction;
    const select = interaction.values[0];

    const embed = (commandName, commands, count) => {
      return new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle(`\\📂 Danh sách ${commandName} [${count}]`)
        .setColor('Random')
        .setThumbnail(cfg.slashPNG)
        .setTimestamp()
        .setFooter({
          text: `Requested by ${user.displayName || user.username}`,
          iconURL: user.displayAvatarURL(true),
        })
        .addFields(commands);
    };
    let commands = [];

    if (select === 'prefix') return helpPrefix(interaction);
    else if (select === 'subcommands') {
      let parents = Array.from(subCommands.values()).map((sub) => sub.parent);
      const filters = parents.filter((item, index) => parents.indexOf(item) === index);

      let count = 0;
      filters.forEach((parent) => {
        let cmd = Array.from(subCommands.values()).filter((sub) => sub.parent === parent);
        commands.push({
          name: `/${parent} [${cmd.length}]`,
          value: `\`\`\`fix\n${cmd.map((c) => c.data?.name || c.name).join(' | ')}\`\`\``,
        });
        count += cmd.length;
      });
      return interaction.update({ embeds: [embed('Sub Command', commands, count)] });
    } else {
      const slashs = Array.from(slashCommands.values()).filter(
        (cmd) => cmd.category.toLowerCase() === select.toLowerCase(),
      );
      commands = slashs.map((slash) => ({
        name: `/${slash.data?.name || slash.name}`,
        value: `\`\`\`fix\n${slash.data?.description || slash.description}\`\`\``,
      }));

      return interaction.update({
        embeds: [embed(`${capitalize(select)} Command`, commands, commands.length)],
      });
    }

    /**
     * Chuyển đổi chữ cái đầu tiên thành chữ hoa
     * @param {String} str - Chuỗi cần chuyển đổi
     * @returns {String} - Chuỗi đã chuyển đổi
     */
    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1) || str;
    }
  },
};
