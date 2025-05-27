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
  data: new SlashCommandBuilder().setName('quote').setDescription('Get a quote from https://zenquotes.io'),
  category: 'misc',
  scooldown: 10,
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

        await interaction.reply({ embeds: [embed] });
      })
      .catch((e) => {
        client.errorEmbed(true, 'Đã xảy ra lỗi khi lấy quote!', e);
      });
  },
};
