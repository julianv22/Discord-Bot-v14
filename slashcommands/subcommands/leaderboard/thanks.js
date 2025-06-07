const { SlashCommandSubcommandBuilder, EmbedBuilder, Client, Interaction, Colors } = require('discord.js');
const thanksProfile = require('../../../config/thanksProfile');

module.exports = {
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('thanks'),
  /**
   * Get thanks leaderboard
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed, catchError } = client;
    const time = options.getString('time');

    try {
      let results = await thanksProfile
        .find({ guildID: guild.id })
        .sort({ thanksCount: -1 })
        .limit(10)
        .catch(console.error);

      if (!results)
        return await interaction.reply(
          errorEmbed({ description: 'There is no thanks data in this server!', emoji: false }),
        );

      let text = '';

      for (let i = 0; i < results.length; i++) {
        const { userID, thanksCount } = results[i];
        const emojis = ['1️⃣', '2️⃣', '3️⃣'];
        text += `${i < 3 ? emojis[i] : `**${i + 1}.**`} <@${userID}> `;
        text += `with ${thanksCount} thank${thanksCount > 1 ? 's' : ''}\n\n`;
      }

      const embed = new EmbedBuilder()
        .setAuthor({ name: '🏆 Thanks Leaderboard', iconURL: guild.iconURL(true) })
        .setTitle(`Top 10 Thanks${time ? ` ${time}` : ''}:`)
        .setDescription(text)
        .setColor(Colors.Gold)
        .setThumbnail(cfg.thanksPNG)
        .setFooter({
          text: `Requested by ${user.displayName || user.username}`,
          iconURL: user.displayAvatarURL(true),
        })
        .setTimestamp();
      return await interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
