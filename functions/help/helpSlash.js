const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  EmbedBuilder,
  Colors,
} = require('discord.js');
const { capitalize } = require('../common/utilities');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Show slash commands list.
   * @param {string} CommandType - Command type.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction. */
  client.helpSlash = async (CommandType, interaction) => {
    const { slashCommands } = client;
    const { guild, user } = interaction;

    const commands = slashCommands
      .filter((cmd) => cmd.category === CommandType)
      .map((cmd) => {
        const subNames = cmd?.data?.options
          ?.filter((opt) => opt instanceof SlashCommandSubcommandBuilder)
          .map((cmd) => cmd?.name);

        const subTree =
          subNames.length > 0
            ? '\n\x1b[35mSub commands:\x1b[34m\n' +
              subNames
                .map((subName, index, array) => {
                  const isLast = index === array.length - 1;
                  return (isLast ? '└──' : '├──') + `${cmd?.data?.name} ${subName}`;
                })
                .join('\n')
            : '';

        return {
          name: `/${cmd?.data?.name || cmd?.name}`,
          value: '\n```ansi\n\x1b[36m' + cmd?.data?.description + subTree + '```',
        };
      });

    const helpEmbed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`\\📂 ${capitalize(CommandType)} Commands [${commands.length}]`)
      .setColor(Colors.DarkGreen)
      .setThumbnail(cfg.slashPNG)
      .setTimestamp()
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
      .addFields(commands);

    return interaction.update({ embeds: [helpEmbed] });
  };
};
