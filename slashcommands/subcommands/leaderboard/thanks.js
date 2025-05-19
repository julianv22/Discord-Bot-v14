const thanksProfile = require('../../../config/thanksProfile');
const { SlashCommandSubcommandBuilder, EmbedBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('thanks'),
  category: 'moderator',
  parent: 'leaderboard',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, options } = interaction;
    const time = options.getString('time');
    const results = await thanksProfile.find({ guildID: guild.id }).sort({ thanksCount: -1 }).limit(10);
    try {
      let text = '';

      for (let i = 0; i < results.length; i++) {
        const { userID, thanksCount } = results[i];
        text += `${i === 0 ? '1️⃣' : i === 1 ? '2️⃣' : i === 2 ? '3️⃣' : '#' + (i + 1)}: <@${userID}> `;
        text += `with ${thanksCount} thank${thanksCount > 1 ? 's' : ''}\n\n`;
      }

      if (!text) return interaction.reply(errorEmbed(true, 'There is no thanks data in this server!'));

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
      await interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (e) {
      console.error(chalk.yellow.bold('Error (/leaderboard thanks):', e));
      return interaction.reply(errorEmbed(true, 'Error thanks leaderboard:', e));
    }
  },
};
