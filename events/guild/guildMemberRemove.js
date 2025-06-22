const { EmbedBuilder, Client, GuildMember, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  name: 'guildMemberRemove',
  /** - Guild Member Remove Event
   * @param {GuildMember} member - Guild Member object
   * @param {Client} client - Discord Client */
  async execute(member, client) {
    try {
      const { guild, user } = member;
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
      const { welcome } = profile.setup;
      if (!profile || !welcome.log) return console.log(chalk.red('No Welcome Channel or Log Channel Set'));

      const emLog = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle('👋 Good bye!')
        .setDescription(`${user} đã rời khỏi server!`)
        .setThumbnail(
          'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/name-badge_1f4db.png',
        )
        .setColor(Colors.DarkVividPink)
        .setTimestamp()
        .addFields(
          { name: 'UserName:', value: user.tag, inline: true },
          { name: 'UserID:', value: `||${user.id}||`, inline: true },
        );

      const logChannel = guild.channels.cache.get(welcome.log);
      if (logChannel) {
        await logChannel.send({ embeds: [emLog] });
      }

      client.serverStats(client, guild.id);

      console.log(chalk.yellow(user.tag + ' left the server'), guild.name);
    } catch (e) {
      client.logError({ item: this.name, desc: 'event' }, e);
    }
  },
};
