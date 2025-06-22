const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction, Colors } = require('discord.js');
const thanksProfile = require('../../../config/thanksProfile');

module.exports = {
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('thanks'),
  /** - Get thanks leaderboard
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
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
        return await interaction.reply(errorEmbed({ desc: 'There is no thanks data in this server!', emoji: false }));

      let thanksList = '';

      for (let i = 0; i < results.length; i++) {
        const { userID, thanksCount } = results[i];
        const emojis = ['1️⃣', '2️⃣', '3️⃣'];
        thanksList += `${i < 3 ? emojis[i] : `**${i + 1}.**`} <@${userID}> `;
        thanksList += `with ${thanksCount} thank${thanksCount > 1 ? 's' : ''}\n\n`;
      }

      return await interaction.reply({
        embeds: [
          {
            author: { name: '🏆 Thanks Leaderboard', iconURL: guild.iconURL(true) },
            title: `Top 10 Thanks${time ? ` ${time}` : ''}:`,
            description: thanksList,
            color: Colors.Gold,
            thumbnail: { url: cfg.thanksPNG },
            timestamp: new Date(),
            footer: { text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) },
          },
        ],
      });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
