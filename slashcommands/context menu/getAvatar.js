const { ContextMenuCommandBuilder, EmbedBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Get Avatar').setType(ApplicationCommandType.User),
  /**
   * Get user avatar
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { targetUser, user } = interaction;
    const avtEmbed = new EmbedBuilder()
      .setColor('Random')
      .setTimestamp()
      .setDescription(`${targetUser}'s Avatar:`)
      .setImage(targetUser.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setFooter({
        text: `Requested by ${user.displayName}`,
        iconURL: user.displayAvatarURL(true),
      });

    return await interaction.reply({ embeds: [avtEmbed] });
  },
};
