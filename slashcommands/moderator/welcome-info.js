const serverProfile = require('../../config/serverProfile');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('welcome-info')
    .setDescription(`Setup Welcome Channel. ${cfg.adminRole} only`),
  category: 'moderator',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    let profile = await serverProfile.findOne({ guildID: guild.id });

    if (!profile) {
      let createOne = await serverProfile.create({
        guildID: guild.id,
        guildName: guild.name,
      });
      createOne.save();
    }
    const welcomeInfo = await client.channels.cache.get(profile?.welomeChannel);
    const logInfo = await client.channels.cache.get(profile?.logChannel);
    const msgInfo = profile?.welomeMessage;

    const fieldValues = [];
    if (welcomeInfo) fieldValues.push(welcomeInfo.toString());
    else fieldValues.push('`undefined`');

    if (logInfo) fieldValues.push(logInfo.toString());
    else fieldValues.push('`undefined`');

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL(true) })
      .setTitle(`Welcome's setup information`)
      .setColor('Aqua')
      .setTimestamp()
      .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
      .addFields([
        { name: 'Welcome channel:', value: fieldValues[0], inline: true },
        { name: 'Log channel:', value: fieldValues[1], inline: true },
      ]);
    if (msgInfo) embed.addFields([{ name: `Server's Information:`, value: msgInfo }]);

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
