const { Client, ChatInputCommandInteraction, Message, GuildMember, EmbedBuilder } = require('discord.js');

/** @param {Client} client */
module.exports = (client) => {
  /**
   * Get user's avatar
   * @param {GuildMember} target Target user
   * @param {ChatInputCommandInteraction|Message} object Interaction or Message
   * @returns {Promise<void>}
   */
  client.getAvatar = async (target, object) => {
    const { catchError } = client;
    const author = object.user || object.author;

    try {
      const avtEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTimestamp()
        .setDescription(`${target}'s Avatar:`)
        .setImage(target.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setFooter({
          text: `Requested by ${author.displayName}`,
          iconURL: author.displayAvatarURL(true),
        });

      return await object.reply({ embeds: [avtEmbed] });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('getAvatar')} function`);
    }
  };
};
