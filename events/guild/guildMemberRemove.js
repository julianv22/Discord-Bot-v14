const { Client, Events, GuildMember, EmbedBuilder, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { logError } = require('../../functions/common/logging');

module.exports = {
  name: Events.GuildMemberRemove,
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
        .setThumbnail(user.displayAvatarURL(true))
        .setAuthor({
          name: `Good bye ${user.tag}!`,
          iconURL: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif',
        })
        .setDescription(`${user} đã rời khỏi server!`)
        .setTimestamp()
        .setFields(
          { name: 'Username:', value: 'User \\🆔:', inline: true },
          { name: user.displayName || user.username, value: `||${user.id}||`, inline: true }
        );

      const logChannel = guild.channels.cache.get(welcome?.logChannelId);
      if (logChannel) await logChannel.send({ embeds: [logEmbed] });

      console.log(chalk.yellow(user.tag + ' left the server'), guild.name);
    } catch (e) {
      logError({ item: this.name, desc: 'event' }, e);
    }
  },
};
