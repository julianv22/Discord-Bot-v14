const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { Client, GuildMember, Message, Interaction, EmbedBuilder } = require('discord.js');
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
    const { errorEmbed } = client;
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
        return msg.reply(errorEmbed({ description: `You must mention someone!`, emoji: false })).then((m) => {
          if (msg == message)
            setTimeout(() => {
              m.delete();
            }, 10000);
        });

      if (user.user ? user.user.bot : user.bot)
        return msg.reply(errorEmbed({ description: `Bots do not need to be thanked! 😝`, emoji: false })).then((m) => {
          if (msg == message)
            setTimeout(() => {
              m.delete();
            }, 10000);
        });

      if (user.id === author.id)
        return msg.reply(errorEmbed({ description: `You cannot thank yourself! 😅`, emoji: false })).then((m) => {
          if (msg == message)
            setTimeout(() => {
              m.delete();
            }, 10000);
        });

      const thanks = await serverThanks.findOne({
        guildID: guild.id,
        userID: user.id,
      });
      let thanksCount = 1;
      if (!thanks) {
        let createOne = await serverThanks.create({
          guildID: guild.id,
          guildName: guild.name,
          userID: user.id,
          usertag: user.tag,
          thanksCount: 1,
          lastThanks: Date.now(),
        });
        thanksCount = 1;
      } else {
        thanksCount = thanks.thanksCount + 1;
      }

      const lastThanks = moment((thanks && thanks.lastThanks) || Date.now())
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
            name: `Thanks count: [${thanksCount}]`,
            value: `\u200b`,
            inline: true,
          },
          { name: 'Last thanks:', value: lastThanks, inline: true },
        ])
        .setImage(imgURL[Math.floor(Math.random() * imgURL.length)])
        .setFooter({
          text: `Use /thanks to thank someone.`,
          iconURL: guild.iconURL(true),
        })
        .setTimestamp();

      msg.reply({ embeds: [embed] });

      // Update thanksCount
      await serverThanks
        .findOneAndUpdate(
          { guildID: guild.id, userID: user.id },
          {
            guildName: guild.name,
            usertag: user.tag,
            thanksCount: thanksCount,
            lastThanks: Date.now(),
          },
        )
        .catch(() => {});
    } catch (e) {
      if (interaction && typeof interaction.reply === 'function') {
        interaction.reply(
          errorEmbed({ title: '❌ Error while executing function thanksUser', description: `${e}`, color: 'Red' }),
        );
      } else if (message && typeof message.reply === 'function') {
        message.reply(
          errorEmbed({ title: '❌ Error while executing function thanksUser', description: `${e}`, color: 'Red' }),
        );
      }
      console.error(chalk.red('Error while executing function thanksUser'), e);
    }
  };
};
