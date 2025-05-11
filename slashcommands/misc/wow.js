const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('wow').setDescription('😍 Wow!'),
  category: 'misc',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { user } = interaction;
    const embed = new EmbedBuilder()
      .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL(true) })
      .setFooter({ text: '😍 Wow!' })
      .setColor('Random')
      .setImage('https://media.discordapp.net/attachments/976364997066231828/1368430209845432320/images.png');

    interaction.reply({ embeds: [embed] });
  },
};
