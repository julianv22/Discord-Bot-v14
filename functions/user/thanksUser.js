const { Client, ChatInputCommandInteraction, Message, GuildMember, EmbedBuilder, Colors } = require('discord.js');
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
    const guildID = guild.id;
    const guildName = guild.name;
    const userID = target.id;
    const usertag = target.tag;

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

      if (!target) {
        const replyMessage = await object.reply(errorEmbed({ desc: 'You must mention someone!' }));
        if (objAuthor) {
          setTimeout(async () => {
            await replyMessage.delete().catch(console.error);
          }, 10000);
        }
        return;
      }

      if (target.user?.bot || target.bot) {
        const replyMessage = await object.reply(errorEmbed({ desc: 'Bots do not need to be thanked! 😝' }));
        if (objAuthor) {
          setTimeout(async () => {
            await replyMessage.delete().catch(console.error);
          }, 10000);
        }
        return;
      }

      if (target.id === author.id) {
        const replyMessage = await object.reply(errorEmbed({ desc: 'You can not thank yourself! 😅' }));
        if (objAuthor) {
          setTimeout(async () => {
            await replyMessage.delete().catch(console.error);
          }, 10000);
        }
        return;
      }

      let thanks = await serverThanks.findOne({ guildID, userID }).catch(console.error);
      let count = 1;
      if (!thanks) {
        thanks = await serverThanks
          .create({
            guildID,
            guildName,
            userID,
            usertag,
            thanksCount: count,
            lastThanks: Date.now(),
          })
          .catch(console.error);

        if (!thanks) return; // If creation failed, stop here
      } else {
        count = thanks.thanksCount + 1;
      }

      const lastThanks = moment(thanks.lastThanks || Date.now())
        .tz('Asia/Ho_Chi_Minh')
        .format('HH:mm ddd, Do MMMM YYYY');

      const embed = new EmbedBuilder()
        .setAuthor({ name: author.displayName || author.username, iconURL: author.displayAvatarURL(true) })
        .setTitle('💖 Special Thanks!')
        .setDescription(`${author} special thanks to ${target}!`)
        .setColor(Colors.Aqua)
        .setImage(imgURL[Math.floor(Math.random() * imgURL.length)])
        .setTimestamp()
        .setFooter({ text: 'Use /thanks to thank someone.', iconURL: guild.iconURL(true) })
        .addFields(
          { name: `Thanks count: [${count}]`, value: '\u200b', inline: true },
          { name: 'Last thanks:', value: lastThanks, inline: true }
        );

      await object.reply({ embeds: [embed] });

      // Update thanksCount
      thanks.guildName = guildName;
      thanks.usertag = usertag;
      thanks.thanksCount = count;
      thanks.lastThanks = Date.now();
      return await thanks
        .save()
        .catch((e) => client.logError({ todo: 'saving thanks profile', item: userID, desc: 'in thanksUser' }, e));
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('thanksUser')} function`);
    }
  };
};
