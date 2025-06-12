const { SlashCommandBuilder, EmbedBuilder, Client, CommandInteraction } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get Avatar')
    .addUserOption((opt) => opt.setName('user').setDescription('Provide user you wanna show Avatar')),
  /**
   * Show user's avatar
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { user: author, options } = interaction;
    const user = options.getUser('user') || author;

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
