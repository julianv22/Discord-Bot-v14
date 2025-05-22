module.exports = {
  data: { name: 'help-menu' },
  /**
   * Menu hỗ trợ
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const { helpPrefix, helpSlash } = client;
    const select = interaction.values[0];
    const help = {
      prefix: () => {
        helpPrefix(interaction);
      },
      slash: () => {
        helpSlash(interaction);
      },
    };
    help[select]();
  },
};
