const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 10,
  data: new SlashCommandBuilder().setName('quote').setDescription('Get a random quote from https://zenquotes.io'),
  /** - Get a random quote from ZenQuotes
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const { catchError } = client;

    /** - @returns {Promise<string>} */
    const getQuote = () => {
      return fetch('https://zenquotes.io/api/random')
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          return '❝ **' + data[0]['q'] + '** ❞\n\n- ' + data[0]['a'] + ' -';
        });
    };

    getQuote()
      .then(async (quote) => {
        return await interaction.reply({
          embeds: [
            {
              author: { name: guild.name, iconURL: guild.iconURL(true) },
              description: quote,
              color: Math.floor(Math.random() * 0xffffff),
              thumbnail: { url: cfg.thumbnailURL },
              timestamp: new Date(),
              footer: {
                text: `Requested by ${user.displayName || user.username}`,
                iconURL: user.displayAvatarURL(true),
              },
            },
          ],
        });
      })
      .catch((e) => {
        return catchError(interaction, e, this);
      });
  },
};
