const { Client, GuildMember, Message, ChatInputCommandInteraction, EmbedBuilder, Colors } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Snipe deleted message
   * @param {GuildMember} target - Target user
   * @param {ChatInputCommandInteraction|Message} object - Interaction or Message */
  client.snipeMessage = async (target, object) => {
    const { errorEmbed, catchError, messageSnipes } = client;
    const user = object.user || object.author;

    try {
      const { guildId, channelId } = object;
      const snipe = await messageSnipes.get(target ? guildId + target.id : channelId);

      if (!snipe)
        return await object.reply(errorEmbed({ desc: `There is nothing to snipe.`, emoji: false })).then((m) => {
          if (object.author)
            setTimeout(async () => {
              await m.delete().catch(console.error);
            }, 5000);
        });

      const { author, channelId: snpChannel, content } = snipe;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: target
            ? `${user.displayName || user.username} snipped message of ${
                target.displayName || (target.user && target.user.displayName) || 'Unknown'
              }`
            : 'Last deleted message:',
          iconURL: 'https://media.discordapp.net/attachments/976364997066231828/1012217326424293416/snipe.png',
        })
        .setColor(Colors.DarkVividPink)
        .setThumbnail(author.displayAvatarURL(true))
        .setTimestamp()
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .addFields(
          { name: 'Author:', value: `${author}`, inline: true },
          { name: target ? 'Channel:' : '\u200b', value: target ? `<#${snpChannel}>` : '\u200b', inline: true },
          { name: 'Content:', value: `${content}` }
        );

      return await object.reply({ embeds: [embed] });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('snipeMessage')} function`);
    }
  };
};
