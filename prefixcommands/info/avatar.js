const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'avatar',
  aliases: ['avt'],
  description: 'Xem Avatar của thành viên.',
  category: 'info',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { author, guild, mentions } = message;
    if (args.join(' ').trim() === '?')
      return client.cmdGuide(message, this.name, this.description, this.aliases, prefix + this.name + ' <user>');
    const user = mentions.users.first() || guild.members.cache.get(args[0]) || author;

    const avtEmbed = new EmbedBuilder()
      .setColor('Random')
      .setTimestamp()
      .setDescription(`Avatar của ${user}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setFooter({
        text: `Requested by ${author.username}`,
        iconURL: author.displayAvatarURL(true),
      });

    message.reply({ embeds: [avtEmbed] });
  },
};
