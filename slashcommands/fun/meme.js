const fetch = require('node-fetch');
const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('meme').setDescription('Get Meme.'),
  category: 'fun',
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild } = interaction;
    //Start
    const Reds = ['memes', 'me_irl', 'dankmemes', 'comedyheaven', 'Animemes'];

    const Rads = Reds[Math.floor(Math.random() * Reds.length)];
    const res = await fetch(`https://www.reddit.com/r/${Rads}/random/.json`);
    const json = await res.json();

    if (!json[0]) return interaction.reply({ embeds: [{ color: 16711680, description: `\\❌ | Đồn như lời!` }], ephemeral: true });

    const data = json[0].data.children[0].data;

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setColor('Random')
      .setURL(`https://reddit.com${data.permalink}`)
      .setTitle(data.title)
      .setDescription(`Tác giả: **${data.author}**`)
      .setImage(data.url)
      .setFooter({ text: `${data.ups || 0} 👍 | ${data.downs || 0} 👎 | ${data.num_comments || 0} 💬` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    //End
  },
};
