const { Client, GuildMember, Message, CommandInteraction, EmbedBuilder, Colors } = require('discord.js');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Snipe deleted message
   * @param {GuildMember} user - User object
   * @param {GuildMember} target - Target object
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Message} message - Message object
   */
  client.snipeMessage = async (user, target, interaction, message) => {
    const { errorEmbed, catchError } = client;
    try {
      const msg = interaction || message;
      const { guildId, channelId } = msg;
      const snipe = await client.snipes.get(target ? guildId + '' + target.id : channelId);

      if (!snipe)
        return await msg.reply(errorEmbed({ description: `There is nothing to snipe.`, emoji: false })).then((m) => {
          if (msg == message)
            setTimeout(async () => {
              await m.delete();
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
        .setTimestamp()
        .setThumbnail(author.displayAvatarURL(true))
        .setFooter({
          text: `Requested by ${user.displayName || user.username}`,
          iconURL: user.displayAvatarURL(true),
        })
        .addFields([{ name: 'Author:', value: `${author}`, inline: true }])
        .addFields({
          name: target ? 'Channel:' : '\u200b',
          value: target ? `<#${snpChannel}>` : '\u200b',
          inline: true,
        })
        .addFields([{ name: 'Content:', value: `${content}` }]);

      await msg.reply({ embeds: [embed] });
    } catch (e) {
      catchError(interaction, e, 'Error while executing snipeMessage function');
    }
  };
};
