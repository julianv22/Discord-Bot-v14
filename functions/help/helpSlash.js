const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { capitalize } = require('../common/utilities');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Show slash commands list.
   * @param {string} CommandType - Command type.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction. */
  client.helpSlash = async (CommandType, interaction) => {
    const { slashCommands, subCommands, listCommands } = client;
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

    const ShowCommand = {
      subcommands: async () => {
        return await interaction.update({
          embeds: [helpEmbed('Sub', listCommands(subCommands, 'parent'), subCommands.size)],
        });
      },
      default: async () => {
        const commands = slashCommands
          .filter((cmd) => cmd.category.toLowerCase() === CommandType.toLowerCase())
          .map((cmd) => ({
            name: `/${cmd?.data?.name || cmd?.name}`,
            value: `\`\`\`ansi\n\x1b[36m${cmd?.data?.description || cmd?.description}\x1b[0m\`\`\``,
          }));
        return await interaction.update({
          embeds: [helpEmbed(CommandType, commands, CommandType.length)],
        });
      },
    };
    (ShowCommand[CommandType] || ShowCommand.default)();
  };
};
