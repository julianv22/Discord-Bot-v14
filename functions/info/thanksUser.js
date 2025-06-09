const { Client, GuildMember, Message, Interaction, EmbedBuilder, Colors } = require('discord.js');
const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Thank user
   * @param {GuildMember} user - User object
   * @param {GuildMember} author - Author object
   * @param {Interaction} interaction - Interaction object
   * @param {Message} message - Message object
   */
  client.thanksUser = async (user, author, interaction, message) => {
    const { errorEmbed, catchError } = client;
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

      const msg = interaction ? interaction : message;
      const { guild } = msg;

      if (!user)
        return msg.reply(errorEmbed({ description: 'You must mention someone!', emoji: false })).then((m) => {
          if (msg == message)
            setTimeout(() => {
              m.delete();
            }, 10000);
        });

      if (user.user ? user.user.bot : user.bot)
        return msg.reply(errorEmbed({ description: 'Bots do not need to be thanked! 😝', emoji: false })).then((m) => {
          if (msg == message)
            setTimeout(() => {
              m.delete();
            }, 10000);
        });

      if (user.id === author.id)
        return msg.reply(errorEmbed({ description: 'You cannot thank yourself! 😅', emoji: false })).then((m) => {
          if (msg == message)
            setTimeout(() => {
              m.delete();
            }, 10000);
        });

      const thanks = await serverThanks.findOne({ guildID: guild.id, userID: user.id }).catch(console.error);
      let count = 1;
      if (!thanks) {
        thanks = await serverThanks
          .create({
            guildID: guild.id,
            guildName: guild.name,
            userID: user.id,
            usertag: user.tag,
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

      const embed = new EmbedBuilder()
        .setAuthor({
          name: author.displayName,
          iconURL: author.displayAvatarURL(true),
        })
        .setTitle('💖 Special Thanks!')
        .setDescription(`${author} special thanks to ${user}!`)
        .setColor('Random')
        .addFields([
          {
            name: `Thanks count: [${count}]`,
            value: '\u200b',
            inline: true,
          },
          { name: 'Last thanks:', value: lastThanks, inline: true },
        ])
        .setImage(imgURL[Math.floor(Math.random() * imgURL.length)])
        .setFooter({
          text: 'Use /thanks to thank someone.',
          iconURL: guild.iconURL(true),
        })
        .setTimestamp();

      msg.reply({ embeds: [embed] });

      // Update thanksCount
      thanks.guildName = guild.name;
      thanks.usertag = user.tag;
      thanks.thanksCount = count;
      thanks.lastThanks = Date.now();
      thanks.save().catch(console.error);
    } catch (e) {
      catchError(interaction, e, 'Error while executing thanksUser function');
    }
  };
};
