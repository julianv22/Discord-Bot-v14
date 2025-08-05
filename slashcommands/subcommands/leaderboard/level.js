const { Client, Interaction, SlashCommandSubcommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { embedMessage } = require('../../../functions/common/logging');

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
    const week = options.getInteger('week');
    const imgURL = options.getString('image');

    if (!imgURL.checkURL()) return await interaction.reply(embedMessage({ desc: 'Please enter a valid image URL.' }));

    await interaction.deferReply();

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkAqua)
        .setThumbnail(cfg.tournament_gif)
        .setAuthor({ name: guild.name + ' Level Leaderboard', iconURL: cfg.onehundred_gif })
        .setTitle('Bảng xếp hạng level tuần #' + week)
        .setDescription(
          'Xem bảng xếp hạng trên 10? [View top 100](https://arcane.bot/leaderboard/954736697453731850)\n\nXem [Rank List](https://discord.com/channels/954736697453731850/954737311843770440/994328694522921030)'
        )
        .setImage(imgURL)
        .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
        .setTimestamp(),
    ];

    await interaction.editReply({ embeds });
  },
};
