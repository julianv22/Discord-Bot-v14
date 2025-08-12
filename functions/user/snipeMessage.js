const { Client, Interaction, Message, EmbedBuilder, Colors } = require('discord.js');
const { embedMessage } = require('../common/logging');

/** @param {Client} client Discord Client */
module.exports = (client) => {
  /** Retrieves and displays a recently deleted message.
   * @param {GuildMember} target The target user whose message was deleted.
   * @param {Interaction|Message} object The interaction or message object. */
  client.snipeMessage = async (target, object) => {
    const { catchError, messageSnipes } = client;
    const user = object.user || object.author;

    try {
      const { guildId, channelId } = object;
      const snipe = await messageSnipes.get(target ? guildId + target.id : channelId);

      if (!snipe) {
        const replyMessage = await object.reply(embedMessage({ desc: `There is nothing to snipe.` }));

        if (object.author && replyMessage.deletable)
          setTimeout(async () => await replyMessage.delete().catch(console.error), 5 * 1000);

        return;
      }

      const { authorId, channelId: snipeChannelId, content } = snipe;
      const author = await object.guild.members.fetch(authorId).catch(console.error);

      const embeds = [
        new EmbedBuilder()
          .setColor(Colors.DarkVividPink)
          .setThumbnail(author.displayAvatarURL(true))
          .setAuthor({
            name: target
              ? `${user.displayName || user.username} snipped message of ${
                  target.displayName || target.user?.displayName || target.username
                }`
              : 'Last deleted message:',
            iconURL: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3af/512.gif',
          })
          .setDescription(`**Author:** ${author}${target ? ` --- **Channel:** <#${snipeChannelId}>` : ''}`)
          .setFooter({
            text: `Requested by ${user.displayName || user.username}`,
            iconURL: user.displayAvatarURL(true),
          })
          .setTimestamp()
          .setFields({ name: 'Content:', value: `${content}` }),
      ];

      await object.reply({ embeds });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('snipeMessage')} function`);
    }
  };
};
