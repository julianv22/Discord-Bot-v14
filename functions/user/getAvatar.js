const { Client, ChatInputCommandInteraction, Message, GuildMember } = require('discord.js');

/** @param {Client} client Client*/
module.exports = (client) => {
  /** - Get user's avatar
   * @param {GuildMember} target Target user
   * @param {ChatInputCommandInteraction|Message} object Interaction or Message */
  client.getAvatar = async (target, object) => {
    const { catchError } = client;
    const author = object.user || object.author;

    try {
      return await object.reply({
        embeds: [
          {
            description: `${target}'s Avatar:`,
            color: Math.floor(Math.random() * 0xffffff),
            image: { url: target.displayAvatarURL({ dynamic: true, size: 1024 }) },
            timestamp: new Date(),
            footer: { text: `Requested by ${author.displayName}`, iconURL: author.displayAvatarURL(true) },
          },
        ],
      });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('getAvatar')} function`);
    }
  };
};
