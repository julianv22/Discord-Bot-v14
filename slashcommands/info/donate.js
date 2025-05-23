const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('donate').setDescription('Donate for Julian-V'),
  category: 'info',
  scooldown: 0,
  /**
   * Donate for Julian-V
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { user } = interaction;
    const img = 'https://media.discordapp.net/attachments/976364997066231828/997976998527914124/Header.png';
    const thumb = 'https://cdn.discordapp.com/avatars/566891661616218132/ba6efb8ea73083a217e45c977e70a921.webp';

    const embed = new EmbedBuilder()
      .setAuthor({
        name: 'Donate for Julian-V',
        iconURL: thumb,
        url: cfg.youtube,
      })
      .setTitle('Thanks for donating!')
      .setDescription('Payment methods:')
      .setColor('Navy')
      .setThumbnail(user.displayAvatarURL(true))
      .setImage(img)
      .addFields([
        {
          name: 'Donate',
          value: '[PlayerDuo](https://playerduo.com/julianvduo)',
          inline: true,
        },
        {
          name: 'Momo',
          value: '[0974.626.222](https://me.momo.vn/vjIyu4FJf2sMtqsQtptn)',
          inline: true,
        },
        {
          name: 'Tip',
          value: '[StreamElements](https://streamelements.com/julianv-4174/tip)',
          inline: true,
        },
      ])
      .setFooter({
        text: 'Requested by ' + (user.displayName || user.username),
        iconURL: user.displayAvatarURL(true),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
