const { Client, Interaction, EmbedBuilder } = require('discord.js');
/**
 * Hiển thị danh sách command prefix.
 * @param {Interaction} interaction - Đối tượng interaction.
 * @param {Client} client - Đối tượng client.
 */
module.exports = (client) => {
  client.helpPrefix = async (interaction) => {
    const { guild, user } = interaction;
    const { prefixCommands, listCommands } = client;
    const { commands = `\\❌ | No commands`, count = 0 } = listCommands(prefixCommands);
    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`Prefix Commands (${prefix}) List`)
      .setDescription(`If you need some help, join my support server: [\`${cfg.supportServer}\`](${cfg.supportLink})`)
      .setColor('Random')
      .addFields([
        {
          name: `Total commands: [${count}]`,
          value: `Command prefix: \`${prefix}\``,
        },
      ])
      .addFields(commands)
      .addFields([
        {
          name: `\u200b`,
          value: `\`${prefix}<command> ?\` to show more details`,
        },
      ])
      .setThumbnail(cfg.helpPNG)
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });
    return interaction.update({ embeds: [embed] });
  };
};
