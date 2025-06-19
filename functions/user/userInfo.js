const {
  Client,
  GuildMember,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Guild,
  Message,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');
const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - User information
   * @param {GuildMember} target - Target user
   * @param {ChatInputCommandInteraction|Message} object - Interaction or Message */
  client.userInfo = async (target, object) => {
    const { errorEmbed, catchError } = client;
    const [guild, author] = [object.guild, object.user || object.author];

    try {
      const member = guild.members.cache.get(target.id);
      if (!member)
        return await (interaction || message).reply(errorEmbed({ desc: 'User is not in this server.', emoji: false }));

      const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);
      const isMod = member.permissions.has(PermissionFlagsBits.ManageMessages);

      // Acknowledgements
      let acknowledgements = '';
      if (target.id === guild.ownerId) acknowledgements = 'Server Owner | ';
      if (isAdmin) acknowledgements += 'Administrator';
      if (isMod) acknowledgements += ' | Moderator';
      if (target.bot) acknowledgements += ' | Bot';
      if (target.premiumSince) acknowledgements += ' | Server Booster';
      if (!acknowledgements) acknowledgements = 'None';

      acknowledgements = `\`\`\`fix\n` + acknowledgements + `\`\`\``;

      const roles = member.roles.cache.filter((r) => r.id !== guild.id).map((r) => r);
      const thanks = await serverThanks.findOne({
        guildID: guild.id,
        userID: target.id,
      });

      embed = new EmbedBuilder()
        .setAuthor({
          name: target.tag || target.user.tag,
          iconURL: target.displayAvatarURL(true),
        })
        .setTitle('⚠️ Member Info ⚠️')
        .setDescription(`👤 **Username:** ${target}`)
        .setColor('Random')
        .setThumbnail(target.displayAvatarURL(true))
        .setFooter({
          text: `Requested by ${author.displayName}`,
          iconURL: author.displayAvatarURL(true),
        })
        .setTimestamp()
        .addFields([
          {
            name: `🆔: ||${target.id || target.user.id}||`,
            value: '\u200b',
            inline: true,
          },
          {
            name: `💖 Thanks count: ${thanks?.thanksCount || 0}`,
            value: '\u200b',
            inline: true,
          },
          {
            name: `⏰ Joined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
            value: `${moment(member.joinedAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}`,
          },
          {
            name: `📆 Created: <t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
            value: `${moment(member.user.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}`,
          },
          { name: '🎖️ Acknowledgements:', value: `${acknowledgements}` },
          //   {name: 'Permissions', value: `\`\`\`fix\n${msg.channel.permissionsFor(member.user.id).toArray().join(' # ')}\`\`\``},
          {
            name: `📃 Roles [${roles.length}]:`,
            value: `${roles.join(' ') || 'No roles'}`,
          },
        ]);

      return await object.reply({ embeds: [embed] });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('userInfo')} function`);
    }
  };
};
