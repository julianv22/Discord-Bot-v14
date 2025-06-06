const { EmbedBuilder, SlashCommandBuilder, Client, Interaction } = require('discord.js');

/** @returns {Promise<string>} */
function getQuote() {
  return fetch('https://zenquotes.io/api/random')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return '❝ **' + data[0]['q'] + '** ❞\n\n- ' + data[0]['a'] + ' -';
    });
}
module.exports = {
  category: 'misc',
  scooldown: 10,
  data: new SlashCommandBuilder().setName('quote').setDescription('Get a quote from https://zenquotes.io'),
  /**
   * Get a random quote from ZenQuotes
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { user, guild } = interaction;
    getQuote()
      .then(async (quote) => {
        const embed = new EmbedBuilder()
          .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
          .setDescription(quote)
          .setColor('Random')
          .setThumbnail(cfg.thumbnailURL)
          .setFooter({
            text: `Requested by ${user.displayName || user.username}`,
            iconURL: user.displayAvatarURL(true),
          })
          .setTimestamp();

        return await interaction.reply({ embeds: [embed] });
      })
      .catch((e) => {
        client.errorEmbed({ title: `\\❌ Error while getting quote`, description: e, color: 'Red' });
      });
  },
};
