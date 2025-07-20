const { Client, Interaction, SlashCommandSubcommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('level'),
  /** - Displays the level leaderboard.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed } = client;
    const week = options.getInteger('week');
    const imgURL = options.getString('image');

    if (!imgURL.checkURL()) return await interaction.reply(errorEmbed({ desc: 'Please enter a valid image URL.' }));

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkAqua)
        .setThumbnail('https://fonts.gstatic.com/s/e/notoemoji/latest/1f3c6/512.gif')
        .setAuthor({
          name: 'Level Leaderboard',
          iconURL: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f4af/512.gif',
        })
        .setTitle('Bảng xếp hạng level tuần #' + week)
        .setDescription(
          'Xem bảng xếp hạng trên 10? [View top 100](https://arcane.bot/leaderboard/954736697453731850)\n\nXem [Rank List](https://discord.com/channels/954736697453731850/954737311843770440/994328694522921030)'
        )
        .setImage(imgURL)
        .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
        .setTimestamp(),
    ];

    return await interaction.reply({ embeds });
  },
};
