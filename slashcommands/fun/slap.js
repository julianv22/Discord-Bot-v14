const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('🤚')
    .addUserOption(opt => opt.setName('target').setDescription('Target your victim')),
  category: 'fun',
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { user, options } = interaction;
    const target = options.getUser('target');
    let desc;
    if (!target || target.id === user.id) desc = `Hmm ${user} is slapping themselves, what! \\👻`;
    else desc = `${user} slapped ${target}...`;

    const random = require('something-random-on-discord').Random;
    let data = await random.getAnimeImgURL('slap');

    const embed = new EmbedBuilder().setColor('Random').setDescription(desc).setImage(data).setFooter({ text: '🤚 Must have been a real baka!' });
    interaction.reply({ embeds: [embed] });
  },
};
