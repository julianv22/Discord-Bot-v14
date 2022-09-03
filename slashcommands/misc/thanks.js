const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('thanks')
    .setDescription('Thanks someone')
    .addUserOption(opt => opt.setName('user').setDescription(`Provide someone you would like to thank`).setRequired(true)),
  category: 'misc',
  scooldown: 30,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, options, user: author } = interaction;
    const user = options.getUser('user');
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

    if (user.bot)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | Bot no need to thank 😝!` }],
        ephemeral: true,
      });

    if (user.id === interaction.user.id)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | You can not thank yourself 😅!` }],
        ephemeral: true,
      });

    const thanks = await serverThanks.findOne({ guildID: guild.id, userID: user.id });
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
      .setAuthor({ name: author.username, iconURL: author.displayAvatarURL(true) })
      .setTitle('💖 | Special Thanks!')
      .setDescription(`${author} special thanks to ${user}!`)
      .addFields([
        { name: `Thanks count: [${thanks?.thanksCount + 1 || 1}]`, value: `\u200b`, inline: true },
        { name: 'Last thanks:', value: lastThanks, inline: true },
      ])
      .setFooter({ text: `Use /thanks to thank someone`, iconURL: guild.iconURL(true) })
      .setTimestamp()
      .setColor('Random')
      .setImage(imgURL[Math.floor(Math.random() * imgURL.length)]);

    interaction.reply({ embeds: [embed] });

    // Update thanksCount
    await serverThanks.findOneAndUpdate(
      { guildID: guild.id, userID: user.id },
      {
        guildName: guild.name,
        usertag: user.tag,
        thanksCount: thanks?.thanksCount + 1 || 1,
        lastThanks: Date.now(),
      }
    );
  },
};
