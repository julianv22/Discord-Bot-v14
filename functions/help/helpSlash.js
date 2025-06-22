const { Client, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } = require('discord.js');
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

    return interaction.update({
      embeds: [
        {
          author: { name: guild.name, iconURL: guild.iconURL(true) },
          title: `\\📂 Danh sách ${capitalize(CommandType === 'subcommands' ? 'sub' : CommandType)} Commands [${
            commands.length
          }]`,
          color: Math.floor(Math.random() * 0xffffff),
          fields: commands,
          thumbnail: { url: cfg.slashPNG },
          timestamp: new Date(),
          footer: {
            text: `Requested by ${user.displayName || user.username}`,
            iconURL: user.displayAvatarURL(true),
          },
        },
      ],
    });
  };
};
