const { Client, ChatInputCommandInteraction, Message, EmbedBuilder, Colors } = require('discord.js');

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

      if (!snipe) {
        const replyMessage = await object.reply(errorEmbed({ desc: `There is nothing to snipe.` }));

        if (object.author)
          setTimeout(async () => {
            await replyMessage.delete().catch(console.error);
          }, 5000);

        return;
      }

      const { author, channelId: snipeId, content } = snipe;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: target
            ? `${user.displayName || user.username} snipped message of ${
                target.displayName || target.user?.displayName || target.username
              }`
            : 'Last deleted message:',
          iconURL: 'https://media.discordapp.net/attachments/976364997066231828/1012217326424293416/snipe.png',
        })
        .setDescription(`**Author:** ${author}${target ? ` -/- **Channel:** <#${snipeId}>` : ''}`)
        .setColor(Colors.DarkVividPink)
        .setThumbnail(author.displayAvatarURL(true))
        .setTimestamp()
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .addFields({ name: 'Content:', value: `${content}` });

      return await object.reply({ embeds: [embed] });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('snipeMessage')} function`);
    }
  };
};
