const { Client, Interaction, Message, GuildMember, EmbedBuilder } = require('discord.js');

/** @param {Client} client Client*/
module.exports = (client) => {
  /** - Get user's avatar
   * @param {GuildMember} target Target user
   * @param {Interaction|Message} object Interaction or Message */
  client.getAvatar = async (target, object) => {
    const { catchError } = client;
    const author = object.user || object.author;

    try {
      const embeds = [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription(`${target}'s Avatar:`)
          .setImage(target.displayAvatarURL({ dynamic: true, size: 1024 }))
          .setFooter({
            text: `Requested by ${author.displayName || author.username}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setTimestamp(),
      ];

      return await object.reply({ embeds });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('getAvatar')} function`);
    }
  };
};
