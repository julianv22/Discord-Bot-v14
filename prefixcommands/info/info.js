const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { EmbedBuilder, ChannelType, Client, Message } = require('discord.js');

module.exports = {
  name: 'info',
  aliases: ['serverinfo'],
  description: 'Xem thông tin server/thành viên',
  category: 'info',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { guild, author } = message;
    const msg = args.join(' ');

    if (msg.trim() === '?')
      return client.cmdGuide(
        message,
        this.name,
        this.description,
        this.aliases,
        `Xem thông tin server: ${prefix + this.aliases}\n\nXem thông tin thành viên: ${prefix + this.name} <user>`
      );

    if (!msg) {
      const bots = guild.members.cache.filter(m => m.user.bot).size;
      const channels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
      const voices = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle('Server Info')
        .setColor('Random')
        .setThumbnail(guild.iconURL(true))
        .setFooter({ text: `Requested by ${author.username}`, iconURL: `${author.displayAvatarURL(true)}` })
        .setTimestamp()
        .addFields([
          { name: 'Server Name:', value: `${guild.name}`, inline: true },
          { name: 'Server ID:', value: `||${guild.id}||`, inline: true },
          { name: 'Server Owner:', value: `<@${guild.ownerId}>` },
          {
            name: `Total Members [${guild.memberCount.toLocaleString()}]:`,
            value: `${(guild.memberCount - bots).toLocaleString()} Members\n${bots} Bots`,
            inline: true,
          },
          { name: 'Total Channels:', value: `${channels} Text\n${voices} Voice`, inline: true },
          { name: 'Total Roles:', value: `${guild.roles.cache.size}`, inline: true },
          { name: 'Total Boosts:', value: `${guild.premiumSubscriptionCount}`, inline: true },
          { name: 'Server Region:', value: `${guild.preferredLocale}`, inline: true },
          { name: 'Verification Level:', value: `${guild.verificationLevel}`, inline: true },
          { name: 'Created at:', value: `${moment(guild.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}` },
        ]);

      message.reply({ embeds: [embed] });
    } else {
      if (!message.mentions.members.first()) return message.reply(`\`\`\`${cfg.x} | Bạn phải @ đến một thành viên!\`\`\``);

      let acknowledgements = '';
      const member = message.mentions.members.first() || message.member || guild.members.cache.get(args[0]);
      const isAdmin = member.permissions.has('Administrator');
      const isMod = member.permissions.has('ManageMessages');

      if (member.id === guild.ownerId) acknowledgements = 'Server Owner | ';
      if (isAdmin) acknowledgements += 'Administrator';
      if (isMod) acknowledgements += ' | Moderator';
      if (member.user.bot) acknowledgements += ' | Bot';
      if (member.premiumSince) acknowledgements += ' | Server Booster';
      if (!acknowledgements) acknowledgements = 'None';

      acknowledgements = `\`\`\`fix\n` + acknowledgements + `\`\`\``;

      const roles = member.roles.cache.filter(r => r.id !== guild.id).map(r => r);

      const thanks = await serverThanks.findOne({ guildID: guild.id, userID: member.id });

      const embed = new EmbedBuilder()
        .setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL(true) })
        .setTitle('Member Info')
        .setDescription(`**Name:** ${member}`)
        .setColor('Random')
        .setThumbnail(member.displayAvatarURL(true))
        .setFooter({ text: `Requested by ${author.username}`, iconURL: author.displayAvatarURL(true) })
        .setTimestamp()
        .addFields([
          { name: 'User ID:', value: `||${member.user.id}||`, inline: true },
          { name: 'Thanks count:', value: `${thanks?.thanksCount || 0}`, inline: true },
          { name: 'Joined at:', value: `${moment(member.joinedAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}` },
          { name: 'Created at:', value: `${moment(member.user.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}` },
          { name: 'Acknowledgements:', value: `${acknowledgements}` },
          // {name: 'Permissions', value: `\`\`\`fix\n${message.channel.permissionsFor(member.user.id).toArray().join(' # ')}\`\`\``},
          { name: `Roles [${roles.length}]:`, value: `${roles.join(' ') || 'No Roles'}` },
        ]);

      message.reply({ embeds: [embed] });
    }
  },
};
