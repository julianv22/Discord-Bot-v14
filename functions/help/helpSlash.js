const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandSubcommandBuilder } = require('discord.js');
const { capitalize } = require('../common/utilities');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Show slash commands list.
   * @param {string} CommandType - Command type.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction. */
  client.helpSlash = async (CommandType, interaction) => {
    const { slashCommands } = client;
    const { guild, user } = interaction;
    /** - Help Embed
     * @param {object[]} commands - Commands list
     * @param {number} count - Commands count */
    const helpEmbed = async (commands, count) => {
      return await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
            .setTitle(
              `\\📂 Danh sách ${capitalize(CommandType === 'subcommands' ? 'sub' : CommandType)} Commands [${count}]`,
            )
            .setColor('Random')
            .setThumbnail(cfg.slashPNG)
            .setTimestamp()
            .setFooter({
              text: `Requested by ${user.displayName || user.username}`,
              iconURL: user.displayAvatarURL(true),
            })
            .addFields(commands),
        ],
      });
    };

    const commands = slashCommands
      .filter((cmd) => cmd.category === CommandType)
      .map((cmd) => {
        const subName = cmd?.data?.options
          ?.filter((opt) => opt instanceof SlashCommandSubcommandBuilder)
          .map((cmd) => cmd?.name);

        return {
          name: `/${cmd?.data?.name || cmd?.name}`,
          value: `\n\`\`\`ansi\n\x1b[36m${cmd?.data?.description}\n${
            subName.length > 0
              ? `\x1b[35mSub commands:\x1b[34m\n` +
                subName
                  .map((sub, index, array) => {
                    const isLast = index === array.length - 1;
                    return `${isLast ? '└──' : '├──'}${cmd?.data?.name} ${sub}`;
                  })
                  .join('\n')
              : ''
          }\`\`\``,
        };
      });

    return helpEmbed(commands, commands.length);
  };
};
