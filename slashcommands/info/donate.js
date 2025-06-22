const { SlashCommandBuilder, Client, ChatInputCommandInteraction, Colors } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('donate').setDescription('Donate for Julian-V'),
  /** - Donate for Julian-V
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user } = interaction;
    const thumbnail = {
      url: 'https://cdn.discordapp.com/avatars/566891661616218132/ba6efb8ea73083a217e45c977e70a921.webp',
    };

    return await interaction.reply({
      embeds: [
        {
          author: { name: 'Donate for Julian-V', iconURL: thumbnail.url, url: cfg.youtube },
          title: 'Thanks for donating!',
          description: 'Payment methods:',
          color: Colors.Navy,
          fields: [
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
          ],
          thumbnail,
          timestamp: new Date(),
          footer: { text: `Requested bye ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) },
        },
      ],
    });
  },
};
