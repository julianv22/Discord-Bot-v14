const { Client, Interaction, EmbedBuilder, Colors } = require('discord.js');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Show prefix commands list.
   *  @param {Interaction} interaction - The command interaction. */
  client.helpPrefix = async (interaction) => {
    const { guild, user } = interaction;
    const { prefixCommands, listCommands } = client;

    const helpEmbed = new EmbedBuilder()
      .setColor(Colors.DarkGreen)
      .setThumbnail(cfg.helpPNG)
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`Prefix Commands [\`${prefix}\`] List`)
      .setDescription(`If you need more help, join my support server: [\`${cfg.supportServer}\`](${cfg.supportLink})`)
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
      .setTimestamp()
      .setFields(
        {
          name: `Total commands: [${prefixCommands.size}]`,
          value: `Command prefix: [\`${prefix}\`]`,
        },
        ...listCommands(prefixCommands),
        {
          name: `\u200b`,
          value: `\`${prefix}command ?\` to show more details`,
        }
      );

    return await interaction.update({ embeds: [helpEmbed] });
  };
};
