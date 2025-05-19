const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get Avatar')
    .addUserOption((opt) => opt.setName('user').setDescription('Provide user you wanna show Avatar')),
  category: 'info',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
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

    await interaction.reply({ embeds: [avtEmbed] });
  },
};
