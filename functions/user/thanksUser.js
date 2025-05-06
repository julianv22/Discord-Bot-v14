const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { Client, GuildMember, Message, Interaction, EmbedBuilder } = require('discord.js');

/** @param {Client} client */
module.exports = (client) => {
  /**
   * @param {GuildMember} user
   * @param {GuildMember} author
   * @param {Interaction} interaction
   * @param {Message} message
   */
  client.thanksUser = async (user, author, interaction, message) => {
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
        return msg
          .reply({
            embeds: [
              {
                color: 16711680,
                description: `\\❌ | You have to mention someone!`,
              },
            ],
            ephemeral: true,
          })
          .then((m) => {
            if (msg == message)
              setTimeout(() => {
                m.delete();
              }, 10000);
          });

      if (user.user ? user.user.bot : user.bot)
        return msg
          .reply({
            embeds: [
              {
                color: 16711680,
                description: `\\❌ | Bot no need to thank 😝!`,
              },
            ],
            ephemeral: true,
          })
          .then((m) => {
            if (msg == message)
              setTimeout(() => {
                m.delete();
              }, 10000);
          });

      if (user.id === author.id)
        return msg
          .reply({
            embeds: [
              {
                color: 16711680,
                description: `\\❌ | You can not thank yourself 😅!`,
              },
            ],
            ephemeral: true,
          })
          .then((m) => {
            if (msg == message)
              setTimeout(() => {
                m.delete();
              }, 10000);
          });

      const thanks = await serverThanks.findOne({
        guildID: guild.id,
        userID: user.id,
      });
      if (!thanks) {
        let createOne = await serverThanks.create({
          guildID: guild.id,
          guildName: guild.name,
          userID: user.id,
          usertag: user.tag,
          thanksCount: 1,
          lastThanks: Date.now(),
        });
        createOne.save();
      }

      const lastThanks = moment(thanks?.lastThanks || Date.now())
        .tz('Asia/Ho_Chi_Minh')
        .format('HH:mm ddd, Do MMMM YYYY');

      const embed = new EmbedBuilder()
        .setAuthor({
          name: author.displayName,
          iconURL: author.displayAvatarURL(true),
        })
        .setTitle('💖 | Special Thanks!')
        .setDescription(`${author} special thanks to ${user}!`)
        .setColor('Random')
        .addFields([
          {
            name: `Thanks count: [${thanks?.thanksCount + 1 || 1}]`,
            value: `\u200b`,
            inline: true,
          },
          { name: 'Last thanks:', value: lastThanks, inline: true },
        ])
        .setImage(imgURL[Math.floor(Math.random() * imgURL.length)])
        .setFooter({
          text: `Use /thanks to thank someone`,
          iconURL: guild.iconURL(true),
        })
        .setTimestamp();

      msg.reply({ embeds: [embed] });

      // Update thanksCount
      await serverThanks.findOneAndUpdate(
        { guildID: guild.id, userID: user.id },
        {
          guildName: guild.name,
          usertag: user.tag,
          thanksCount: thanks?.thanksCount + 1 || 1,
          lastThanks: Date.now(),
        },
      );
    } catch (e) {
      console.error(chalk.yellow.bold('Error while running thanksUser'), e);
    }
  };
};
