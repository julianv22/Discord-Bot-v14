const { Client, Interaction, EmbedBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  type: 'modals',
  data: { name: 'reaction-role' },
  /** - Reaction Modal
   * @param {Interaction} interaction Modal Message Modal Submit Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { customId, fields, message } = interaction;
    const [, textInput] = customId.split(':');
    const stringInput = fields.getTextInputValue(textInput);
    const reactionEmbed = EmbedBuilder.from(message.embeds[0]);
    const reactionButton = ActionRowBuilder.from(message.components[0]);

    const editEmbed = {
      title: () => {
        return reactionEmbed.setTitle(stringInput);
      },
      color: () => {
        return reactionEmbed.setColor(stringInput.toEmbedColor());
      },
    };

    if (!editEmbed[textInput]) {
      client.catchError(
        interaction,
        new Error(chalk.yellow("Invalid TextInput's customId ") + chalk.green(textInput)),
        'Lỗi Modal Reaction'
      );
      return await interaction.reply(client.errorEmbed({ desc: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.' }));
    }

    editEmbed[textInput]();
    await interaction.update({ embeds: [reactionEmbed], components: [reactionButton] });
  },
};
