const { Client, ChatInputCommandInteraction, EmbedBuilder, Colors } = require('discord.js');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Show slash commands list.
   * @param {string} CommandType - Command type.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction. */
  client.helpSlash = async (CommandType, interaction) => {
    const { slashCommands } = client;
    const { guild, user } = interaction;
    const commands = slashCommands.toEmbedFields(CommandType);

    const helpEmbed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`\\📂 ${CommandType.toCapitalize()} Commands [${commands.length}]`)
      .setColor(Colors.DarkGreen)
      .setThumbnail(cfg.slashPNG)
      .setTimestamp()
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
      .addFields(commands);

    return interaction.update({ embeds: [helpEmbed] });
  };
};
