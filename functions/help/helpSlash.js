const { Client, Interaction, EmbedBuilder, Colors } = require('discord.js');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Show slash commands list.
   * @param {string} CommandType - The type of the command.
   * @param {Interaction} interaction - The command interaction. */
  client.helpSlash = async (CommandType, interaction) => {
    const { slashCommands } = client;
    const { guild, user } = interaction;
    const commands = slashCommands.listCommandsAndSubs(CommandType);

    const helpEmbed = new EmbedBuilder()
      .setColor(Colors.DarkGreen)
      .setThumbnail(cfg.slashPNG)
      .setAuthor({ name: guild.name, iconURL: cfg.book_gif })
      .setTitle(`\\📂 ${CommandType.toCapitalize()} Commands [${commands.length}]`)
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
      .setTimestamp()
      .setFields(commands);

    return interaction.update({ embeds: [helpEmbed] });
  };
};
