const { EmbedBuilder, Interaction, Client } = require('discord.js');

/** @param {Client} client */
module.exports = (client) => {
  /** @param {Number} userMove @param {Interaction} interaction */
  client.rpsGame = async (userMove, interaction) => {
    try {
      const { user } = interaction;
      let botMove = Math.floor(Math.random() * 3) + 1; // 1 = rock; 2 = paper; 3 = scissors
      let win; // 0 = lose; 1 = tie; 2 = win

      switch (userMove) {
        case 1:
          win = botMove == 2 ? 0 : botMove == 1 ? 1 : 2;
          break;

        case 2:
          win = botMove == 3 ? 0 : botMove == 2 ? 1 : 2;
          break;

        case 3:
          win = botMove == 1 ? 0 : botMove == 3 ? 1 : 2;
          break;
      }

      function rps(move) {
        return {
          emoji: move == 1 ? '✊' : move == 2 ? '✋' : '✌',
          color: win == 0 ? 'Red' : win == 1 ? 'Orange' : 'Green',
          result: win == 0 ? 'You lost!' : win == 1 ? 'We tied!' : 'You won!',
          compare: win == 0 ? '<' : win == 1 ? '=' : '>',
        };
      }

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Hi, ${user.username}`,
          iconURL: user.displayAvatarURL(true),
        })
        .setColor(rps().color)
        .setThumbnail(user.displayAvatarURL(true))
        .setTimestamp()
        .setTitle(rps().result)
        .setDescription(`You chose ${rps(userMove).emoji} ${rps().compare} ${rps(botMove).emoji} bot chose`);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (e) {
      console.error(chalk.yellow.bold('Error while running rpsGame'), e);
    }
  };
};
