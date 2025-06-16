const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

/** @param {Client} client - Client. */
module.exports = (client) => {
  /**
   * Show prefix commands list.
   * @param {ChatInputCommandInteraction} interaction - Interaction object.
   */
  client.helpPrefix = async (interaction) => {
    const { guild, user } = interaction;
    const { prefixCommands, listCommands } = client;
    const { commands = '❌ | No commands', count = 0 } = listCommands(prefixCommands);
    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`Prefix Commands [\`${prefix}\`] List`)
      .setDescription(`If you need more help, join my support server: [\`${cfg.supportServer}\`](${cfg.supportLink})`)
      .setColor('Random')
      .addFields([
        {
          name: `Total commands: [${count}]`,
          value: `Command prefix: [\`${prefix}\`]`,
        },
      ])
      .addFields(commands)
      .addFields([
        {
          name: `\u200b`,
          value: `\`${prefix}command ?\` to show more details`,
        },
      ])
      .setThumbnail(cfg.helpPNG)
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });
    return await interaction.update({ embeds: [embed] });
  };
};
