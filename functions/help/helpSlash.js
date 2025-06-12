const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { capitalize } = require('../common/utilities');

/** @param {Client} client - Client object. */
module.exports = (client) => {
  /**
   * Show slash commands list.
   * @param {string} CommandType - Command type.
   * @param {Interaction} interaction - Interaction object.
   */
  client.helpSlash = async (CommandType, interaction) => {
    const { slashCommands, subCommands } = client;
    const { guild, user } = interaction;
    /**
     * Help Embed
     * @param {String} commandName - Name of the command
     * @param {Array} commands - Commands to display
     * @param {Number} count - Count of commands
     * @returns {EmbedBuilder}
     */
    const helpEmbed = (commandName, commands, count) => {
      return new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle(`\\📂 Danh sách ${capitalize(commandName)} Commands [${count}]`)
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
    const ShowCommand = {
      subcommands: async () => {
        let parents = Array.from(subCommands.values()).map((sub) => sub.parent);
        parents = parents.filter((item, index) => parents.indexOf(item) === index);

        let count = 0;

        for (const parent of parents) {
          const command = subCommands.filter((sub) => sub.parent === parent);
          commands.push({
            name: `/${parent} [${command.size}]`,
            value: `\`\`\`ansi\n\u001b[36m${command
              .map((cmd) => `${cmd.data?.name || cmd.name}`)
              .join(' | ')}\u001b[0m\`\`\``,
          });
          count += command.size;
        }
        return await interaction.update({ embeds: [helpEmbed('Sub', commands, count)] });
      },
      default: async () => {
        commands = Array.from(slashCommands.values()).filter(
          (cmd) => cmd.category.toLowerCase() === CommandType.toLowerCase(),
        );
        commands = commands.map((cmd) => ({
          name: `/${cmd.data?.name || cmd.name}`,
          value: `\`\`\`ansi\n\u001b[36m${cmd.data?.description || cmd.description}\u001b[0m\`\`\``,
        }));
        return await interaction.update({
          embeds: [helpEmbed(CommandType, commands, commands.length)],
        });
      },
    };
    (ShowCommand[CommandType] || ShowCommand.default)(CommandType);
  };
};
