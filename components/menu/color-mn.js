const { EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: { name: 'color-mn' },
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { user, values } = interaction;
    const color = values[0];
    const embed = new EmbedBuilder().setDescription(`⬅ Hey ${user}! You selected color: **${color}**`).setColor(color);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
