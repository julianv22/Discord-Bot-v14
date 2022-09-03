const { Message, Client, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'snipe',
  aliases: ['snp'],
  description: 'Bắn tỉa tin nhắn đã bị xoá.',
  category: 'misc',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?')
      return client.cmdGuide(message, this.name, this.description, this.aliases, prefix + this.name + ` | ${prefix + this.name} <user>`);

    const { cmdGuide, snipes } = client;
    const { author: user, guild, channel, mentions } = message;
    const target = mentions.members.first() || guild.members.cache.get(args[0]);
    const snipe = snipes.get(user ? user.id : channel.id);

    if (!snipe)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | There is nothing to snipe!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    const { author, channel: snpChannel, content } = snipe;
    const embed = new EmbedBuilder()
      .setAuthor({
        name: target ? `${user.username} snipped message of ${target.user.username}` : 'Last deleted message:',
        iconURL: 'https://media.discordapp.net/attachments/976364997066231828/1012217326424293416/snipe.png',
      })
      .setColor('DarkVividPink')
      .setTimestamp()
      .setThumbnail(author.displayAvatarURL(true))
      .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL(true) })
      .addFields([
        { name: 'Tác giả:', value: `${snipe.author}`, inline: true },
        { name: target ? `Channel:` : '\u200b', value: target ? `${snpChannel}` : '\u200b', inline: true },
        { name: 'Nội dung:', value: `${content}` },
      ]);

    message.reply({ embeds: [embed] });
  },
};
