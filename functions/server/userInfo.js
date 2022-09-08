const { Client, GuildMember, Interaction, EmbedBuilder, Guild, Message } = require('discord.js');
const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');

/** @param {Client} client */
module.exports = client => {
  /**
   *
   * @param {Guild} guild
   * @param {GuildMember} user
   * @param {GuildMember} author
   * @param {Interaction} interaction
   * @param {Message} message
   */
  client.userInfo = async (guild, user, author, interaction, message) => {
    const member = guild.members.cache.get(user.id);
    const isAdmin = member.permissions.has('Administrator');
    const isMod = member.permissions.has('ManageMessages');

    // Acknowledgements
    let acknowledgements = '';
    if (user.id === guild.ownerId) acknowledgements = 'Server Owner | ';
    if (isAdmin) acknowledgements += 'Administrator';
    if (isMod) acknowledgements += ' | Moderator';
    if (user.bot) acknowledgements += ' | Bot';
    if (user.premiumSince) acknowledgements += ' | Server Booster';
    if (!acknowledgements) acknowledgements = 'None';

    acknowledgements = `\`\`\`fix\n` + acknowledgements + `\`\`\``;

    const roles = member.roles.cache.filter(r => r.id !== guild.id).map(r => r);
    const thanks = await serverThanks.findOne({ guildID: guild.id, userID: user.id });

    embed = new EmbedBuilder()
      .setAuthor({ name: user.tag || user.user.tag, iconURL: user.displayAvatarURL(true) })
      .setTitle('Member Info')
      .setDescription(`**Name:** ${user}`)
      .setColor('Random')
      .setThumbnail(user.displayAvatarURL(true))
      .setFooter({ text: `Requested by ${author.username}`, iconURL: author.displayAvatarURL(true) })
      .setTimestamp()
      .addFields([
        { name: 'User ID:', value: `||${user.id || user.user.id}||`, inline: true },
        { name: 'Thanks count:', value: `${thanks?.thanksCount || 0}`, inline: true },
        {
          name: `Joined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
          value: `${moment(member.joinedAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}`,
        },
        {
          name: `Created: <t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
          value: `${moment(member.user.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}`,
        },
        { name: 'Acknowledgements:', value: `${acknowledgements}` },
        //   {name: 'Permissions', value: `\`\`\`fix\n${msg.channel.permissionsFor(member.user.id).toArray().join(' # ')}\`\`\``},
        { name: `Roles [${roles.length}]:`, value: `${roles.join(' ') || 'No role'}` },
      ]);

    interaction ? interaction.reply({ embeds: [embed] }) : message.reply({ embeds: [embed] });
  };
};
