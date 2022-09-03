const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { ContextMenuCommandBuilder, EmbedBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder().setName(`Get Info`).setType(ApplicationCommandType.User),
  category: 'context menu',
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, targetUser: user, user: author } = interaction;
    const member = interaction.guild.members.cache.get(user.id);
    const isAdmin = member.permissions.has('Administrator');
    const isMod = member.permissions.has('ManageMessages');
    const roles = member.roles.cache.filter(r => r.id !== guild.id).map(r => r);
    const thanks = await serverThanks.findOne({ guildID: guild.id, userID: user.id });

    // Acknowledgements
    let acknowledgements = '';
    if (user.id === guild.ownerId) acknowledgements = 'Server Owner | ';
    if (isAdmin) acknowledgements += 'Administrator';
    if (isMod) acknowledgements += ' | Moderator';
    if (user.bot) acknowledgements += ' | Bot';
    if (user.premiumSince) acknowledgements += ' | Server Booster';
    if (!acknowledgements) acknowledgements = 'None';
    acknowledgements = `\`\`\`fix\n` + acknowledgements + `\`\`\``;

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL(true) })
      .setTitle('Member Info')
      .setDescription(`**Name:** ${user}`)
      .setColor('Random')
      .setThumbnail(user.displayAvatarURL(true))
      .setFooter({ text: `Requested by ${author.username}`, iconURL: author.displayAvatarURL(true) })
      .setTimestamp()
      .addFields([
        { name: 'User ID:', value: `||${user.id}||`, inline: true },
        { name: 'Thanks count:', value: `${thanks?.thanksCount || 0}`, inline: true },
        { name: 'Joined at:', value: `${moment(member.joinedAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}` },
        { name: 'Created at:', value: `${moment(member.user.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}` },
        { name: 'Acknowledgements:', value: `${acknowledgements}` },
        { name: `Roles [${roles.length}]:`, value: `${roles.join(' ') || 'No role'}` },
      ]);

    await interaction.reply({ embeds: [embed] });
  },
};
