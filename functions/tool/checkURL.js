module.exports = (client) => {
  /**
   * Kiểm tra xem đối tượng strInput có phải là URL hay không
   * @param {String} strInput - Đối tượng strInput
   * @returns {Boolean} - Trả về true nếu đối tượng strInput là URL, ngược lại trả về false
   */
  client.checkURL = function checkURL(strInput) {
    try {
      if (strInput) {
        var res = strInput.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
        );
        return res !== null;
      } else res;
    } catch (e) {
      console.error(chalk.red('Error while running checkURL'), e);
    }
  };
};
