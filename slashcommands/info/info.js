const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription(`Server/Member's Info`)
    .addUserOption(opt => opt.setName('user').setDescription(`Member's Info`)),
  category: 'info',
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user: author, options } = interaction;
    const user = options.getUser('user');
    if (!user) {
      const bots = guild.members.cache.filter(m => m.user.bot).size;
      const channels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
      const voices = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;

      var embed = new EmbedBuilder()
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
      interaction.reply({ embeds: [embed] });
    } else {
      // const msg = await interaction.deferReply({ fetchReply: true });
      const user = options.getUser('user');
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
          //   {name: 'Permissions', value: `\`\`\`fix\n${msg.channel.permissionsFor(member.user.id).toArray().join(' # ')}\`\`\``},
          { name: `Roles [${roles.length}]:`, value: `${roles.join(' ') || 'No role'}` },
        ]);

      interaction.reply({ embeds: [embed] });
    }
  },
};
