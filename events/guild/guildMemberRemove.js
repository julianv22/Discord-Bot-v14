const { EmbedBuilder, Client, GuildMember } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
module.exports = {
  name: 'guildMemberRemove',
  /**
   * Thành viên rời khỏi server
   * @param {GuildMember} member - Đối tượng member
   * @param {Client} client - Đối tượng client
   */
  async execute(member, client) {
    try {
      const { guild, user } = member;
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(() => {});
      if (!profile || !profile?.logChannel) return console.log(chalk.red('No Channel Set'));

      const { logChannel: logID } = profile;
      const emLog = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle('👋 Good bye!')
        .setDescription(`${user} đã rời khỏi server!`)
        .setThumbnail(
          'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/name-badge_1f4db.png',
        )
        .setColor('Red')
        .setTimestamp()
        .addFields(
          { name: 'UserName:', value: user.tag, inline: true },
          { name: 'UserID:', value: `||${user.id}||`, inline: true },
        );

      const logChannel = guild.channels.cache.get(logID);
      if (logChannel) {
        await logChannel.send({ embeds: [emLog] });
      }

      client.serverStats(client, guild.id);

      console.log(chalk.yellow(user.tag + ' left the server'), guild.name);
    } catch (e) {
      console.error(chalk.red('Error while running guildMemberRemove event'), e);
    }
  },
};
