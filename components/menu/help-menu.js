module.exports = {
  data: { name: 'help-menu' },
  /**
   * Menu hỗ trợ
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const { helpPrefix, helpSlash } = client;
    const {
      message: { components },
      values,
    } = interaction;
    const selected = values[0];
    const help = {
      prefix: () => {
        helpPrefix(interaction);
      },
      slash: () => {
        return interaction.update({
          embeds: [
            {
              author: { name: `Select Slash Command Category ⤵️`, iconURL: cfg.slashPNG },
              color: Math.floor(Math.random() * 0xffffff),
            },
          ],
        });
      },
      default: () => {
        helpSlash(selected, interaction);
      },
    };
    (help[selected] || help.default)(selected);
  },
};
