const { Client, Interaction, Message, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Get User information
   * @param {GuildMember} target - Target user
   * @param {Interaction|Message} object - Interaction or Message */
  client.userInfo = async (target, object) => {
    const { errorEmbed, catchError } = client;
    const [guild, author] = [object.guild, object.user || object.author];
    const { id: guildID } = guild;
    const { id: userID } = target;

    try {
      const member = guild.members.cache.get(userID);
      if (!member) return await object.reply(errorEmbed({ desc: 'User is not in this server.' }));

      const acknowledgements = [];
      if (userID === guild.ownerId) acknowledgements.push('Server Owner');
      if (member.permissions.has(PermissionFlagsBits.Administrator)) acknowledgements.push('Administrator');
      if (member.permissions.has(PermissionFlagsBits.ManageMessages)) acknowledgements.push('Moderator');
      if (target.bot) acknowledgements.push('Bot');
      if (member.premiumSince) acknowledgements.push('Server Booster');

      const acknowledgementsString =
        acknowledgements.length > 0 ? `\`\`\`fix\n${acknowledgements.join(' | ')}\`\`\`` : 'None';

      const roles = member.roles.cache.filter((r) => r.id !== guild.id).map((r) => r);
      const thanks = await serverThanks.findOne({ guildID, userID });

      const embeds = [
        new EmbedBuilder()
          .setAuthor({
            name: target.tag,
            iconURL: target.displayAvatarURL(true),
          })
          .setTitle('⚠️ Member Info ⚠️')
          .setDescription(`👤 **Username:** ${target}`)
          .setColor('Random')
          .setThumbnail(target.displayAvatarURL(true))
          .setFooter({
            text: `Requested by ${author.displayName || author.username}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setTimestamp()
          .addFields([
            {
              name: `🆔: ||${userID}||`,
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
            { name: '🎖️ Acknowledgements:', value: `${acknowledgementsString}` },
            //   {name: 'Permissions', value: `\`\`\`fix\n${msg.channel.permissionsFor(member.user.id).toArray().join(' # ')}\`\`\``},
            {
              name: `📃 Roles [${roles.length}]:`,
              value: `${roles.join(' ') || 'No roles'}`,
            },
          ]),
      ];

      return await object.reply({ embeds });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('userInfo')} function`);
    }
  };
};
