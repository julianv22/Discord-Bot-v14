const thanksProfile = require('../../config/thanksProfile');
const { SlashCommandBuilder, EmbedBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('thanks-leaderboard')
    .setDescription(`Thanks leaderboard. ${cfg.adminRole} only`)
    .addStringOption((opt) => opt.setName('time').setDescription('Time to thanks calculate')),
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const time = options.getString('time');
    const results = await thanksProfile.find({ guildID: guild.id }).sort({ thanksCount: -1 }).limit(10);

    let text = '';

    for (let i = 0; i < results.length; i++) {
      const { userID, thanksCount } = results[i];
      text += `${i === 0 ? '1️⃣' : i === 1 ? '2️⃣' : i === 2 ? '3️⃣' : '#' + (i + 1)}: <@${userID}> `;
      text += `with ${thanksCount} thank${thanksCount > 1 ? 's' : ''}\n\n`;
    }

    if (!text)
      return interaction.reply({
        embeds: [
          {
            color: 16711680,
            description: `\\❌ | There ís no thank data in this server!`,
          },
        ],
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`Top 10 Thanks${time ? ` ${time}` : ''}:`)
      .setDescription(text)
      .setColor('Gold')
      .setThumbnail(cfg.thanksPNG)
      .setFooter({
        text: `Requested by ${user.displayName}`,
        iconURL: user.displayAvatarURL(true),
      })
      .setTimestamp();
    interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
