const { Client, GuildMember, Message, ChatInputCommandInteraction } = require('discord.js');
const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Thanks user
   * @param {GuildMember} target - Target user
   * @param {ChatInputCommandInteraction|Message} object - Interaction or Message */
  client.thanksUser = async (target, object) => {
    const { errorEmbed, catchError } = client;
    const { guild, user, author: objAuthor } = object;
    const author = user || objAuthor;

    try {
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

      if (!target)
        return await object.reply(errorEmbed({ desc: 'You must mention someone!', emoji: false })).then((m) => {
          if (objAuthor)
            setTimeout(async () => {
              await m.delete().catch(console.error);
            }, 10000);
        });

      if (target.user ? target.user.bot : target.bot)
        return await object
          .reply(errorEmbed({ desc: 'Bots do not need to be thanked! 😝', emoji: false }))
          .then((m) => {
            if (objAuthor)
              setTimeout(async () => {
                await m.delete().catch(console.error);
              }, 10000);
          });

      if (target.id === author.id)
        return object.reply(errorEmbed({ desc: 'You can not thank yourself! 😅', emoji: false })).then((m) => {
          if (objAuthor)
            setTimeout(async () => {
              await m.delete().catch(console.error);
            }, 10000);
        });

      const thanks = await serverThanks.findOne({ guildID: guild.id, userID: target.id }).catch(console.error);
      let count = 1;
      if (!thanks) {
        thanks = await serverThanks
          .create({
            guildID: guild.id,
            guildName: guild.name,
            userID: target.id,
            usertag: target.tag,
            thanksCount: count,
            lastThanks: Date.now(),
          })
          .catch(console.error);
      } else {
        count = thanks.thanksCount + 1;
      }

      const lastThanks = moment(thanks.lastThanks || Date.now())
        .tz('Asia/Ho_Chi_Minh')
        .format('HH:mm ddd, Do MMMM YYYY');

      await object.reply({
        embeds: [
          {
            author: { name: author.displayName || author.username, iconURL: author.displayAvatarURL(true) },
            title: '💖 Special Thanks!',
            description: `${author} special thanks to ${target}!`,
            color: Math.floor(Math.random() * 0xffffff),
            fields: [
              {
                name: `Thanks count: [${count}]`,
                value: '\u200b',
                inline: true,
              },
              { name: 'Last thanks:', value: lastThanks, inline: true },
            ],
            image: { url: imgURL[Math.floor(Math.random() * imgURL.length)] },
            timestamp: new Date(),
            footer: { text: 'Use /thanks to thank someone.', iconURL: guild.iconURL(true) },
          },
        ],
      });

      // Update thanksCount
      thanks.guildName = guild.name;
      thanks.usertag = target.tag;
      thanks.thanksCount = count;
      thanks.lastThanks = Date.now();
      return await thanks.save().catch(console.error);
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('thanksUser')} function`);
    }
  };
};
