const { Client, ChatInputCommandInteraction, Message, User, EmbedBuilder } = require('discord.js');

/** @param {Client} client Client*/
module.exports = (client) => {
  /** - Get user's avatar
   * @param {User} target Target user
   * @param {ChatInputCommandInteraction|Message} object Interaction or Message */
  client.getAvatar = async (target, object) => {
    const { catchError } = client;
    const author = object.user || object.author;

    try {
      const embed = new EmbedBuilder()
        .setDescription(`${target}'s Avatar:`)
        .setColor('Random')
        .setImage(target.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setTimestamp()
        .setFooter({ text: `Requested by ${author.displayName}`, iconURL: author.displayAvatarURL(true) });

      return await object.reply({ embeds: [embed] });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('getAvatar')} function`);
    }
  };
};
