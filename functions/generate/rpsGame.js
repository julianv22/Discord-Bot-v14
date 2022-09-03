const { EmbedBuilder, Interaction, Client } = require('discord.js');

/** @param {Client} client */
module.exports = client => {
  /**
   * @param {Number} userMove
   * @param {Interaction} interaction
   */
  client.rpsGame = async (userMove, interaction) => {
    const { user } = interaction;
    let botMove = Math.floor(Math.random() * 3) + 1; // 1 = rock; 2 = paper; 3 = scissros
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

    const embed = new EmbedBuilder()
      .setAuthor({ name: `Hi, ${user.username}`, iconURL: user.displayAvatarURL(true) })
      .setColor(win == 0 ? 'Red' : win == 1 ? 'Orange' : 'Green')
      .setThumbnail(user.displayAvatarURL(true))
      .setTimestamp()
      .setTitle(`${win == 0 ? 'You lost!' : win == 1 ? 'We tied!' : 'You won!'}`)
      .setDescription(
        `You chose ${userMove == 1 ? '✊' : userMove == 2 ? '✋' : '✌'} ${win == 0 ? '<' : win == 1 ? '=' : '>'} ${
          botMove == 1 ? '✊' : botMove == 2 ? '✋' : '✌'
        } bot chose`
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  };
};
