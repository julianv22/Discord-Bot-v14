const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'avatar',
  aliases: ['avt'],
  description: 'Xem avatar của thành viên.',
  category: 'info',
  cooldown: 0,
  /**
   * Get user avatar
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
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
        text: `Requested by ${author.displayName}`,
        iconURL: author.displayAvatarURL(true),
      });

    await message.reply({ embeds: [avtEmbed] });
  },
};
