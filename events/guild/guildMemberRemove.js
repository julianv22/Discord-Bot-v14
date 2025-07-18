const { Client, GuildMember, EmbedBuilder, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  name: 'guildMemberRemove',
  /** - Guild Member Remove Event
   * @param {GuildMember} member - Guild Member object
   * @param {Client} client - Discord Client */
  async execute(member, client) {
    try {
      const { guild, user } = member;

      const profile = await serverProfile.findOne({ guildId: guild.id }).catch(console.error);

      const { welcome } = profile || {};
      if (!profile || !welcome?.logChannelId) return console.log(chalk.red('No Log channel set'));

      const logEmbed = new EmbedBuilder()
        .setColor(Colors.DarkVividPink)
        .setThumbnail(
          'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/name-badge_1f4db.png'
        )
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle(`👋 Good bye ${user.tag}!`)
        .setDescription(`${user} đã rời khỏi server!`)
        .setTimestamp()
        .setFields(
          { name: 'Username:', value: 'User \\🆔:', inline: true },
          { name: user.displayName || user.username, value: `||${user.id}||`, inline: true }
        );

      const logChannel = guild.channels.cache.get(welcome?.logChannelId);
      if (logChannel) await logChannel.send({ embeds: [logEmbed] });

      client.serverStats(guild.id);
      console.log(chalk.yellow(user.tag + ' left the server'), guild.name);
    } catch (e) {
      client.logError({ item: this.name, desc: 'event' }, e);
    }
  },
};
