const { Client, GuildMember, EmbedBuilder, AttachmentBuilder } = require('discord.js');
// const path = require('path');
// const Canvas = require('@napi-rs/canvas');
// const { request } = require('undici');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  name: 'guildMemberAdd',
  /** - Guild Member Add Event
   * @param {GuildMember} member - Guild Member object
   * @param {Client} client - Discord Client */
  async execute(member, client) {
    try {
      const { guild, user } = member;

      const profile = await serverProfile.findOne({ guildId: guild.id }).catch(console.error);

      const { welcome } = profile || {};
      if (!profile || !welcome?.channelId || !welcome?.logChannelId)
        return console.log(chalk.red('No Welcome channel or Log channel set'));

      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x00bce3)
        .setThumbnail(user.displayAvatarURL(true))
        .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
        .setTitle(`Welcome ${user.tag}👋`)
        .setDescription(`Chào mừng ${user} tham gia server **${guild.name}!**  😍`)
        .setImage(cfg.welcomePNG)
        .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
        .setTimestamp()
        .setFields([
          {
            name: `Bạn là thành viên thứ ${guild.memberCount} của server`,
            value: 'Chúc bạn một ngày làm việc vui vẻ!',
          },
        ]);
      if (welcome?.message) welcomeEmbed.addFields([{ name: "Server's Information:", value: welcome?.message }]);

      const logEmbed = new EmbedBuilder()
        .setColor(0x00bce3)
        .setThumbnail(
          'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/new-button_1f195.png'
        )
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle('👋 Thành viên mới tham gia!')
        .setDescription(`${user} đã tham gia server!`)
        .setTimestamp()
        .setFields(
          { name: 'UserTag:', value: 'User \\🆔:', inline: true },
          { name: user.tag, value: `||${user.id}||`, inline: true }
        );

      const welcomeChannel = guild.channels.cache.get(welcome?.channelId);
      const logChannel = guild.channels.cache.get(welcome?.logChannelId);

      if (welcomeChannel) await welcomeChannel.send({ embeds: [welcomeEmbed] });
      if (logChannel) await logChannel.send({ embeds: [logEmbed] });

      client.serverStats(guild.id);
      console.log(chalk.yellow(user.tag + ' joined the server'), guild.name);
    } catch (e) {
      client.logError({ item: this.name, desc: 'event' }, e);
    }
  },
};
