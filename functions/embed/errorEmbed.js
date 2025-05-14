/** @param {Client} client */
module.exports = (client) => {
  /**
   * @param {Boolean} isError
   * @param {String} strInput
   * @param {String} strError
   */
  client.errorEmbed = function errorEmbed(isError, strInput, strError) {
    let strJoin = isError;
    if (typeof strJoin === 'boolean') {
      strJoin = isError ? '\\❌ | ' : '\\✅ | ';
    }
    return {
      embeds: [
        {
          color: isError ? 16711680 : 65280,
          description: strJoin + strInput + (strError ? `\n${strError}` : ''),
        },
      ],
      ephemeral: true,
    };
  };
};
