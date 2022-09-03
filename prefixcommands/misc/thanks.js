const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'thanks',
  aliases: ['ty'],
  description: 'Gửi lời cảm ơn tới một ai đó.',
  category: 'misc',
  cooldown: 30,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, this.aliases, prefix + this.name + ' <user>');

    const imgURL = [
      'https://cdn.discordapp.com/attachments/976364997066231828/987822146279587850/unknown.png',
      'https://media.discordapp.net/attachments/976364997066231828/988317420106174484/unknown.png',
      'https://cdn.discordapp.com/attachments/976364997066231828/988317854610907136/unknown.png',
      'https://cdn.discordapp.com/attachments/976364997066231828/988318049616670740/unknown.png',
      'https://media.discordapp.net/attachments/976364997066231828/988318184018960464/unknown.png',
      'https://cdn.discordapp.com/attachments/976364997066231828/988318415037005904/unknown.png',
      'https://cdn.discordapp.com/attachments/976364997066231828/988318803664445530/unknown.png',
      'https://www.ketoan.vn/wp-content/uploads/2020/12/thank.jpg',
      'https://img.freepik.com/free-vector/thank-you-neon-sign-design-template-neon-sign_77399-331.jpg',
      'https://i.pinimg.com/originals/7b/d9/46/7bd946c65b8aa3654236e6f5cb7fa0fd.gif',
      'https://2.bp.blogspot.com/-83klB_SGIfA/VpyvOosaHyI/AAAAAAAASJI/ol3l6ADeLc0/s1600/Hinh-anh-cam-on-thank-you-dep-nhat-Ohaylam.com-%25283%2529.jpg',
      'https://png.pngtree.com/thumb_back/fw800/background/20201020/pngtree-rose-thank-you-background-image_425104.jpg',
    ];

    const { guild, author } = message;
    const member = message.mentions.members.first();

    if (!member)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Bạn phải @ một ai đó!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    if (member.user.bot)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Bot không cần cảm ơn 😝!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    if (member.id === author.id)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Bạn không thể cảm ơn chính mình 😅!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    // Finde thanksCount
    const thanks = await serverThanks.findOne({ guildID: guild.id, userID: member.id });
    if (!thanks) {
      let createOne = await serverThanks.create({
        guildID: guild.id,
        guildName: guild.name,
        userID: member.id,
        usertag: member.user.tag,
        count: 1,
        lastThanks: Date.now(),
      });
      createOne.save();
    }
    const lastThanks = moment(thanks?.lastThanks || Date.now())
      .tz('Asia/Ho_Chi_Minh')
      .format('HH:mm ddd, Do MMMM YYYY');
    const embed = new EmbedBuilder()
      .setAuthor({ name: author.username, iconURL: author.displayAvatarURL(true) })
      .setTitle('💖 | Special Thanks!')
      .setDescription(`${author} đã gửi lời cảm ơn tới ${member}!`)
      .addFields([
        { name: `Số lần được cảm ơn: [${thanks?.thanksCount + 1 || 1}]`, value: `\u200b`, inline: true },
        { name: 'Lần cuối được cảm ơn:', value: `${lastThanks}`, inline: true },
      ])
      .setFooter({
        text: `Sử dụng ${prefix}${this.name} | ${prefix}${this.aliases} để cảm ơn người khác`,
        iconURL: guild.iconURL(true),
      })
      .setTimestamp()
      .setColor('Random')
      .setImage(`${imgURL[Math.floor(Math.random() * imgURL.length)]}`);

    message.reply({ embeds: [embed] });
    // Update thanksCount
    await serverThanks.findOneAndUpdate(
      { guildID: guild.id, userID: member.id },
      {
        guildName: guild.name,
        usertag: member.user.tag,
        thanksCount: thanks?.thanksCount + 1 || 1,
        lastThanks: Date.now(),
      }
    );
  },
};
