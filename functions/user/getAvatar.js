const { Client, Interaction, Message, GuildMember, EmbedBuilder } = require('discord.js');

/** @param {Client} client Client*/
module.exports = (client) => {
  /** - Gets a user's avatar.
   * @param {GuildMember} target - The target user.
   * @param {Interaction|Message} object - The interaction or message object. */
  client.getAvatar = async (target, object) => {
    const { catchError } = client;
    const author = object?.user || object?.author;

    try {
      const embeds = [
        new EmbedBuilder()
          .setColor(Math.floor(Math.random() * 0xffffff))
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
