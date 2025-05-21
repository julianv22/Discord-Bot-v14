const { EmbedBuilder, Interaction, Client } = require('discord.js');

/** @param {Client} client */
module.exports = (client) => {
  /** @param {Number} userMove @param {Interaction} interaction */
  client.rpsGame = async (userMove, interaction) => {
    const { user } = interaction;
    let botMove = Math.floor(Math.random() * 3);

    const RPS_CONFIG = {
      Emojis: { 0: '🔨', 1: '📄', 2: '✂️' },
      Results: { Lose: 0, Tie: 1, Win: 2 },
      Compares: { 0: '<', 1: '=', 2: '>' },
      ResultStrings: { 0: `Lose \\🏳️`, 1: `Tie \\🤝`, 2: `Win \\🎉` },
      Colors: { 0: 'Red', 1: 'Orange', 2: 'Green' },
    };

    const {
      Emojis,
      Results: { Tie, Win, Lose },
      Compares,
      ResultStrings,
      Colors,
    } = RPS_CONFIG;

    const resultMatrix = [
      [Tie, Lose, Win],
      [Win, Tie, Lose],
      [Lose, Win, Tie],
    ];

    /**
     * Tính toán kết quả của trò chơi kéo búa bao
     * @param {Number} userMove - Nước đi của người dùng (0: Rock, 1: Paper, 2: Scissors)
     * @param {Number} botMove - Nước đi của bot (0: Rock, 1: Paper, 2: Scissors)
     * @returns {Object} Kết quả trò chơi với thông tin hiển thị
     */
    function rpsResult(userMove, botMove) {
      const res = resultMatrix[userMove][botMove];

      return {
        result: ResultStrings[res],
        color: Colors[res],
        description: `〔You ${Emojis[userMove]}〕 ${Compares[res]} 〔Bot ${Emojis[botMove]}〕`,
      };
    }

    try {
      const rps = rpsResult(userMove, botMove);

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Hi, ${user.displayName || user.username}`,
          iconURL: user.displayAvatarURL(true),
        })
        .setColor(rps.color)
        .setThumbnail(user.displayAvatarURL(true))
        .setTimestamp()
        .setTitle('You ' + rps.result)
        .setDescription(rps.description);

      return interaction.update({ embeds: [embed], ephemeral: true });
    } catch (e) {
      console.error(chalk.red('Error while running rpsGame'), e);
    }
  };
};
