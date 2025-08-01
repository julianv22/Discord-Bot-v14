const { Client, Interaction, Message, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { embedMessage } = require('../common/logging');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Get User information
   * @param {GuildMember} target - The target user.
   * @param {Interaction|Message} object - The interaction or message object. */
  client.userInfo = async (target, object) => {
    const { catchError } = client;
    const [guild, author] = [object.guild, object?.user || object?.author];
    const [guildId, userId] = [guild.id, target.id];

    try {
      const member = guild.members.cache.get(userId);
      if (!member) return await object.reply(embedMessage({ desc: 'User is not in this server.' }));

      const acknowledgements = [];
      if (userId === guild.ownerId) acknowledgements.push('Server Owner');
      if (member.permissions.has(PermissionFlagsBits.Administrator)) acknowledgements.push('Administrator');
      if (member.permissions.has(PermissionFlagsBits.ManageMessages)) acknowledgements.push('Moderator');
      if (target.bot) acknowledgements.push('Bot');
      if (member.premiumSince) acknowledgements.push('Server Booster');

      const acknowledgementsString =
        acknowledgements.length > 0 ? `\`\`\`fix\n${acknowledgements.join(' | ')}\`\`\`` : 'None';

      const roles = member.roles.cache.filter((role) => role.id !== guild.id).map((role) => role);
      const profile = await serverThanks.findOne({ guildId, userId });

      const embeds = [
        new EmbedBuilder()
          .setColor(Math.floor(Math.random() * 0xffffff))
          .setThumbnail(target.displayAvatarURL(true))
          .setAuthor({ name: `${target.tag} Information`, iconURL: cfg.warning_gif })
          .setDescription(`👤 **Username:** ${target}`)
          .setFooter({
            text: `Requested by ${author.displayName || author.username}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setTimestamp()
          .setFields(
            { name: `🆔: ||${userId}||`, value: '\u200b' },
            { name: `💖 Thanks Count: ${profile?.thanksCount || 0}`, value: '\u200b' },
            {
              name: `⏰ Joined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
              value: `${moment(member.joinedAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}`,
              inline: true,
            },
            {
              name: `📆 Created: <t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
              value: `${moment(member.user.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}`,
              inline: true,
            },
            { name: '🎖️ Acknowledgements:', value: `${acknowledgementsString}` },
            //   {name: 'Permissions', value: `\`\`\`fix\n${msg.channel.permissionsFor(member.user.id).toArray().join(' # ')}\`\`\``},
            { name: `📃 Roles [${roles.length}]:`, value: `${roles.join(' ') || 'No roles'}` }
          ),
      ];

      await object.reply({ embeds });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('userInfo')} function`);
    }
  };
};
