const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('😘')
    .addUserOption(opt => opt.setName('target').setDescription('Provide user you wanna kiss 👄!').setRequired(true)),
  category: 'fun',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { user } = interaction;
    const target = interaction.options.getUser('target');

    if (target.id === user.id)
      return interaction.reply({ embeds: [{ color: 16711680, description: `\\❌ | Don't take selfies like that 🤣` }], ephemeral: true });

    const random = require('something-random-on-discord').Random;
    let data = await random.getAnimeImgURL('kiss');
    const embed = new EmbedBuilder()
      .setColor('#FF69B4')
      .setDescription(`👄 **|** **${user}** *kissed*  **${target}**`)
      .setImage(data)
      .setFooter({ text: `👀` });

    interaction.reply({ embeds: [embed] });
  },
};
