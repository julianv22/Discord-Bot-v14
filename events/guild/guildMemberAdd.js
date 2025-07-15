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
      const { id: guildID, name: guildName } = guild;

      const profile = await serverProfile.findOne({ guildID }).catch(console.error);
      if (!profile || !welcome.channel || !welcome.log)
        return console.log(chalk.red('No Welcome Channel or Log Channel Set'));

      const { welcome } = profile?.setup || {};
      // // Create Background
      // const bgUrl = path.join(__dirname, '../../config/bg.png');
      // const canvas = Canvas.createCanvas(854, 480);
      // const ctx = canvas.getContext('2d');
      // const c = { h: canvas.height, w: canvas.width };
      // const background = await Canvas.loadImage(bgUrl);
      // ctx.drawImage(background, 0, 0, c.w, c.h);

      // /**
      //  * Thêm text vào canvas
      //  * @param {string} text - Chuỗi cần hiển thị
      //  * @param {number} x - Tọa độ x
      //  * @param {number} y - Tọa độ y
      //  * @param {number} size - Kích thước
      //  */
      // function addContext(text, x, y, size) {
      //   ctx.font = `${text.length < 25 ? size : 40}px Consolas`;
      //   ctx.fillText(text, x, y);
      // }

      // let gradient = ctx.createLinearGradient(c.w / 2, 155, c.w / 2, 0);
      // gradient.addColorStop(0, 'white');
      // gradient.addColorStop(0.25, '#00ff00');
      // gradient.addColorStop(0.5, 'yellow');
      // gradient.addColorStop(0.75, '#ffcc00');
      // gradient.addColorStop(1, 'red');
      // // Create Avatar
      // ctx.strokeRect(0, 0, c.w, c.h);
      // ctx.fillStyle = 'rgba(0,0,0,0.7)';
      // ctx.fillRect(20, 75, c.w - 40, c.h - 95);
      // const { body } = await request(user.displayAvatarURL({ extension: 'png' }));
      // const avt = await Canvas.loadImage(await body.arrayBuffer());
      // ctx.save();
      // ctx.beginPath();
      // ctx.lineWidth = 5;
      // ctx.strokeStyle = gradient;
      // ctx.arc(c.w / 2, 80, 75, 0, Math.PI * 2, true);
      // ctx.stroke();
      // ctx.closePath();
      // ctx.clip();
      // ctx.drawImage(avt, c.w / 2 - 75, 5, 150, 150);
      // ctx.restore();

      // // Create Text
      // ctx.textAlign = 'center';
      // ctx.fillStyle = '#ffff60';
      // addContext(`${user.displayName}`, c.w / 2, c.h / 2, 75);
      // addContext(`#${user.discriminator}`, c.w / 2, c.h / 2 + 40, 36);
      // ctx.fillStyle = '#FFF';
      // addContext(`You are ${guild.memberCount}th member!`, c.w / 2, c.h - 140, 32);
      // ctx.font = '30px Consolas';
      // ctx.fillStyle = '#00ffff';
      // ctx.fillText('Welcome to:', 120, c.h - 90);
      // if (guild.name.length > 40) ctx.font = '26px Consolas';
      // ctx.fillText(`${guild.name}'s Server`, c.w / 2, c.h - 40);

      const welcomeEmbed = new EmbedBuilder()
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL(true) })
        .setTitle('Welcome 👋')
        .setDescription(`Chào mừng ${user} tham gia server **${guildName}!**  😍`)
        .addFields([
          {
            name: `Bạn là thành viên thứ ${guild.memberCount} của server`,
            value: 'Chúc bạn một ngày làm việc vui vẻ!',
          },
        ])
        .setColor(0x00bce3)
        .setThumbnail(user.displayAvatarURL(true))
        .setImage(cfg.welcomePNG)
        .setFooter({ text: guildName, iconURL: guild.iconURL(true) })
        .setTimestamp();
      if (welcome.message) welcomeEmbed.addFields([{ name: `Server's Information:`, value: welcome.message }]);

      // const attachment = new AttachmentBuilder(await canvas.encode('png'), {
      //   name: 'welcome.png',
      // });

      const channel = guild.channels.cache.get(welcome.channel);
      if (channel) await channel.send({ embeds: [welcomeEmbed] });
      // await channel.send({ files: [attachment] });

      const logChannel = guild.channels.cache.get(welcome.log);

      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setAuthor({ name: guildName, iconURL: guild.iconURL(true) })
          .setTitle('👋 Thành viên mới tham gia!')
          .setDescription(`${user} đã tham gia server!`)
          .setColor(0x00bce3)
          .setThumbnail(
            'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/new-button_1f195.png'
          )
          .setTimestamp()
          .addFields(
            { name: 'Tên người dùng:', value: user.tag, inline: true },
            { name: 'ID:', value: `||${user.id}||`, inline: true }
          );

        await logChannel.send({ embeds: [logEmbed] });
      }

      client.serverStats(guild.id);
      console.log(chalk.yellow(user.tag + ' joined the server'), guildName);
    } catch (e) {
      client.logError({ item: this.name, desc: 'event' }, e);
    }
  },
};
