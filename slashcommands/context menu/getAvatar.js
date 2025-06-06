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
    const { targetUser: user, user: author } = interaction;
    const avtEmbed = new EmbedBuilder()
      .setColor('Random')
      .setTimestamp()
      .setDescription(`${user}'s Avatar:`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setFooter({
        text: `Requested by ${author.displayName}`,
        iconURL: author.displayAvatarURL(true),
      });

    return await interaction.reply({ embeds: [avtEmbed] });
  },
};
