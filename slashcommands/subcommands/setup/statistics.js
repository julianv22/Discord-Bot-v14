const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  EmbedBuilder,
  Colors,
} = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('statistics'),
  /** - Setup server statistics
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const { serverStats } = client;
    const totalChannel = options.getChannel('total-count-channel');
    const memberChannel = options.getChannel('member-count-channel');
    const botChannel = options.getChannel('bot-count-channel');
    const presenceChannel = options.getChannel('presence-count-channel');

    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);

    if (!profile)
      profile = await serverProfile
        .create({ guildID: guild.id, guildName: guild.name, prefix: prefix })
        .catch(console.error);

    const { statistics } = profile;

    if (!statistics) statistics = {};

    profile.guildName = guild.name;
    statistics.totalChannel = totalChannel.id;
    statistics.memberChannel = memberChannel.id;
    statistics.botChannel = botChannel.id;
    statistics.presenceChannel = presenceChannel.id;

    await profile.save().catch(console.error);

    serverStats(guild.id);

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('\\✅ Server stats set up successfully!')
      .setColor(Colors.DarkGreen)
      .setThumbnail('https://emoji.discadia.com/emojis/5dc63f16-97b4-402e-8d1f-a76e15fdd6ab.png')
      .setTimestamp()
      .addFields(
        { name: 'Total Count Channel:', value: `${totalChannel}` },
        { name: 'Members Count Channel:', value: `${memberChannel}` },
        { name: 'Bots Count Channel:', value: `${botChannel}` },
        { name: 'Preseneces Count Channel:', value: `${presenceChannel}` }
      );

    return await interaction.reply({ embeds: [embed], flags: 64 });
  },
};
