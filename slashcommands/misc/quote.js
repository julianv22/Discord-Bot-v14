const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

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
        const embed = new EmbedBuilder()
          .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
          .setDescription(quote)
          .setColor('Random')
          .setThumbnail(cfg.thumbnailURL)
          .setTimestamp()
          .setFooter({
            text: `Requested by ${user.displayName || user.username}`,
            iconURL: user.displayAvatarURL(true),
          });

        return await interaction.reply({ embeds: [embed] });
      })
      .catch((e) => {
        return catchError(interaction, e, this);
      });
  },
};
