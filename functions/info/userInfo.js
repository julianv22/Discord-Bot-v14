const { Client, GuildMember, Interaction, EmbedBuilder, Guild, Message, PermissionFlagsBits } = require('discord.js');
const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * User information
   * @param {Guild} guild - Guild object
   * @param {GuildMember} user - User object
   * @param {GuildMember} author - Author object
   * @param {Interaction} interaction - Interaction object
   * @param {Message} message - Message object
   */
  client.userInfo = async (guild, user, author, interaction, message) => {
    try {
      const member = guild.members.cache.get(user.id);
      if (!member) {
        const errorEmbed = {
          embeds: [{ color: 16711680, title: '❌ Error', description: 'User is not in this server.' }],
        };
        if (interaction && typeof interaction.reply === 'function') {
          interaction.reply({ ...errorEmbed, ephemeral: true }).catch(() => {});
        } else if (message && typeof message.reply === 'function') {
          message.reply(errorEmbed).catch(() => {});
        }
        return;
      }
      const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);
      const isMod = member.permissions.has(PermissionFlagsBits.ManageMessages);

      // Acknowledgements
      let acknowledgements = '';
      if (user.id === guild.ownerId) acknowledgements = 'Server Owner | ';
      if (isAdmin) acknowledgements += 'Administrator';
      if (isMod) acknowledgements += ' | Moderator';
      if (user.bot) acknowledgements += ' | Bot';
      if (user.premiumSince) acknowledgements += ' | Server Booster';
      if (!acknowledgements) acknowledgements = 'None';

      acknowledgements = `\`\`\`fix\n` + acknowledgements + `\`\`\``;

      const roles = member.roles.cache.filter((r) => r.id !== guild.id).map((r) => r);
      const thanks = await serverThanks.findOne({
        guildID: guild.id,
        userID: user.id,
      });

      embed = new EmbedBuilder()
        .setAuthor({
          name: user.tag || user.user.tag,
          iconURL: user.displayAvatarURL(true),
        })
        .setTitle('⚠️ Member Info ⚠️')
        .setDescription(`👤 **Username:** ${user}`)
        .setColor('Random')
        .setThumbnail(user.displayAvatarURL(true))
        .setFooter({
          text: `Requested by ${author.displayName}`,
          iconURL: author.displayAvatarURL(true),
        })
        .setTimestamp()
        .addFields([
          {
            name: `🆔: ||${user.id || user.user.id}||`,
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

      (interaction ? interaction : message).reply({ embeds: [embed] });
    } catch (e) {
      const errorEmbed = {
        embeds: [{ color: 16711680, title: '❌ Error', description: `${e}` }],
      };
      if (interaction && typeof interaction.reply === 'function') {
        interaction.reply({ ...errorEmbed, ephemeral: true }).catch(() => {});
      } else if (message && typeof message.reply === 'function') {
        message.reply(errorEmbed).catch(() => {});
      }
      console.error(chalk.red('Error while running userInfo'), e);
    }
  };
};
