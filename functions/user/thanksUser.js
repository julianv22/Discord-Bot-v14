const { Client, Interaction, Message, EmbedBuilder, Colors } = require('discord.js');
const thanksProfile = require('../../config/thanksProfile');
const moment = require('moment-timezone');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Thanks a user.
   * @param {GuildMember} target - The target user to thank.
   * @param {Interaction|Message} object - The interaction or message object. */
  client.thanksUser = async (target, object) => {
    const { errorEmbed, catchError } = client;
    const {
      guild,
      guildId,
      guild: { name: guildName },
    } = object;
    const author = object?.user || object?.author;
    const [userId, userName] = [target.id, target.displayName || target.username];

    try {
      const URLs = [
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

      /** - Sends a reply message with an error embed.
       * @param {string} desc - The description for the error embed. */
      const replyMessage = async (desc) => {
        const replyMessage = await object.reply(errorEmbed({ desc }));

        if (object?.author && replyMessage.deletable)
          setTimeout(async () => await replyMessage.delete().catch(console.error), 10 * 1000);
      };

      if (!target) return replyMessage('You must mention someone!');
      if (target.user?.bot || target?.bot) return replyMessage('Bots do not need to be thanked! 😝');
      if (target.id === author.id) return replyMessage('You cannot thank yourself! 😅');

      const profile = await thanksProfile
        .findOneAndUpdate({ guildId, userId }, { guildName, userName }, { upsert: true, new: true })
        .catch(console.error);

      if (!profile) return replyMessage('No data found for this server. Please try again later!');
      else profile.thanksCount += 1;

      const lastThanks = moment(profile?.lastThanks || Date.now())
        .tz('Asia/Ho_Chi_Minh')
        .format('HH:mm ddd, Do MMMM YYYY');

      const embeds = [
        new EmbedBuilder()
          .setColor(Colors.Aqua)
          .setAuthor({
            name: `Special Thanks ${target.displayName || target.username}`,
            iconURL: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f49e/512.gif',
          })
          .setThumbnail('https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f_200d_1f525/512.gif')
          .setDescription(`${author} special thanks to ${target}!`)
          .setImage(URLs[Math.floor(Math.random() * URLs.length)])
          .setFooter({ text: 'Use /thanks to thank someone.', iconURL: guild.iconURL(true) })
          .setTimestamp()
          .setFields(
            { name: `Thanks Count: [${profile?.thanksCount}]`, value: '\u200b', inline: true },
            { name: 'Last Thanks:', value: lastThanks, inline: true }
          ),
      ];

      await object.reply({ embeds });

      // Update thanksCount
      profile.guildName = guildName;
      profile.userName = userName;
      profile.lastThanks = Date.now();
      await profile.save().catch(console.error);
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('thanksUser')} function`);
    }
  };
};
