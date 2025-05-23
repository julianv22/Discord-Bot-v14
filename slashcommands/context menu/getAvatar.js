const { ContextMenuCommandBuilder, EmbedBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');
module.exports = {
  data: new ContextMenuCommandBuilder().setName('Get Avatar').setType(ApplicationCommandType.User),
  category: 'context menu',
  scooldown: 0,
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

    await interaction.reply({ embeds: [avtEmbed] });
  },
};
