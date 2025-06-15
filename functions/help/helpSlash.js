const { Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const { capitalize } = require('../common/utilities');

/** @param {Client} client - Client object. */
module.exports = (client) => {
  /**
   * Show slash commands list.
   * @param {string} CommandType - Command type.
   * @param {CommandInteraction} interaction - Interaction object.
   */
  client.helpSlash = async (CommandType, interaction) => {
    const { slashCommands, subCommands } = client;
    const { guild, user } = interaction;
    /**
     * Help Embed
     * @param {string} commandName - Name of the command
     * @param {Array} commands - Commands to display
     * @param {number} count - Count of commands
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

        let totalCount = 0;
        for (const parent of parents) {
          const command = subCommands.filter((sub) => sub.parent === parent);
          commands.push({
            name: `/${parent} [${command.size}]`,
            value: `\`\`\`ansi\n\x1b[36m${command
              .map((cmd) => `${cmd.data?.name || cmd.name}`)
              .join(' | ')}\x1b[0m\`\`\``,
          });
          totalCount += command.size;
        }
        return await interaction.update({ embeds: [helpEmbed('Sub', commands, totalCount)] });
      },
      default: async () => {
        commands = Array.from(slashCommands.values()).filter(
          (cmd) => cmd.category.toLowerCase() === CommandType.toLowerCase(),
        );
        commands = commands.map((cmd) => ({
          name: `/${cmd.data?.name || cmd.name}`,
          value: `\`\`\`ansi\n\x1b[36m${cmd.data?.description || cmd.description}\x1b[0m\`\`\``,
        }));
        return await interaction.update({
          embeds: [helpEmbed(CommandType, commands, commands.length)],
        });
      },
    };
    (ShowCommand[CommandType] || ShowCommand.default)();
  };
};
