module.exports = (client) => {
  client.checkVideos = function checkVideos(strInput) {
    try {
      console.log(chalk.yellow.bold('Checking videos...'));
    } catch (e) {
      console.error(chalk.yellow.bold('Error while running checkVideos'), e);
    }
  };
};
