const { Client, ChatInputCommandInteraction } = require('discord.js');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Show prefix commands list.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction. */
  client.helpPrefix = async (interaction) => {
    const { guild, user } = interaction;
    const { prefixCommands, listCommands } = client;

    return await interaction.update({
      embeds: [
        {
          author: { name: guild.name, iconURL: guild.iconURL(true) },
          title: `Prefix Commands [\`${prefix}\`] List`,
          description: `If you need more help, join my support server: [\`${cfg.supportServer}\`](${cfg.supportLink})`,
          color: Math.floor(Math.random() * 0xffffff),
          fields: [
            {
              name: `Total commands: [${prefixCommands.size}]`,
              value: `Command prefix: [\`${prefix}\`]`,
            },
            ...listCommands(prefixCommands),
            {
              name: `\u200b`,
              value: `\`${prefix}command ?\` to show more details`,
            },
          ],
          thumbnail: { url: cfg.helpPNG },
          footer: { text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) },
        },
      ],
    });
  };
};
