const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('punch')
    .setDescription('👊')
    .addUserOption(opt => opt.setName('target').setDescription('Target your victim').setRequired(true)),
  category: 'fun',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { user, options } = interaction;
    const target = options.getUser('target');
    const random = require('something-random-on-discord').Random;
    let data = await random.getAnimeImgURL('punch');
    const embed = new EmbedBuilder().setColor('Random').setDescription(`${user} punched ${target}.`).setImage(data).setFooter({ text: '👊' });
    interaction.reply({ embeds: [embed] });
  },
};
