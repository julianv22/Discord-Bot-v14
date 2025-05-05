const serverProfile = require('../../config/serverProfile');
const { SlashCommandBuilder, EmbedBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('server-stats')
    .setDescription(`Setup Server statistics count. ${cfg.adminRole} only`)
    .addChannelOption((opt) =>
      opt.setName('total-count-channel').setDescription('Total Count Channel').setRequired(true),
    )
    .addChannelOption((opt) =>
      opt.setName('members-count-channel').setDescription('Members Count Channel').setRequired(true),
    )
    .addRoleOption((opt) => opt.setName('member-role').setDescription('Member Role').setRequired(true))
    .addChannelOption((opt) => opt.setName('bots-count-channel').setDescription('Bots Count Channel').setRequired(true))
    .addRoleOption((opt) => opt.setName('bot-role').setDescription('Bot Role').setRequired(true))
    .addChannelOption((opt) =>
      opt.setName('presences-count-channel').setDescription('Presences Count Channel').setRequired(true),
    ),
  category: 'moderator',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, options } = interaction;

    let profile = await serverProfile.findOne({ guildID: guild.id });
    if (!profile) {
      let createOne = await serverProfile.create({
        guildID: guild.id,
        guildName: guild.name,
      });
      createOne.save();
    }

    const totalChannel = options.getChannel('total-count-channel');
    const membersChannel = options.getChannel('members-count-channel');
    const memberrole = options.getRole('member-role');
    const botsChannel = options.getChannel('bots-count-channel');
    const botrole = options.getRole('bot-role');
    const presencesChannel = options.getChannel('presences-count-channel');

    await serverProfile.findOneAndUpdate(
      { guildID: guild.id },
      {
        guildName: guild.name,
        totalChannel: totalChannel.id,
        membersChannel: membersChannel.id,
        memberRole: memberrole.id,
        botsChannel: botsChannel.id,
        botRole: botrole.id,
        statsChannel: presencesChannel.id,
      },
    );

    client.serverStats(client, guild.id);

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('\\✅ Server stats set up successfully!')
      .setThumbnail('https://emoji.discadia.com/emojis/5dc63f16-97b4-402e-8d1f-a76e15fdd6ab.png')
      .setTimestamp()
      .addFields(
        { name: 'Total Count Channel:', value: `${totalChannel}` },
        { name: 'Members Count Channel:', value: `${membersChannel}` },
        { name: 'Member Role:', value: `${memberrole}` },
        { name: 'Bots Count Channel:', value: `${botsChannel}` },
        { name: 'Bot Role:', value: `${botrole}` },
        { name: 'Preseneces Count Channel:', value: `${presencesChannel}` },
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
