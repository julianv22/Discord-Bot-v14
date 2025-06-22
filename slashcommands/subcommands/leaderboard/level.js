const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { checkURL } = require('../../../functions/common/utilities');

module.exports = {
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('level'),
  /** - Get level leaderboard
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed, catchError } = client;
    const [week, imgURL] = [options.getInteger('week'), options.getString('image')];

    try {
      if (!checkURL(imgURL))
        return await interaction.reply(errorEmbed({ desc: 'Vui lòng nhập chính xác Image URL', emoji: false }));

      const embed = new EmbedBuilder()
        .setAuthor({ name: '🏆 Level Leaderboard', iconURL: user.displayAvatarURL(true) })
        .setTitle('Bảng xếp hạng level tuần #' + week)
        .setDescription(
          'Xem bảng xếp hạng trên 10? [View top 100](https://arcane.bot/leaderboard/954736697453731850)\n\nXem [Rank List](https://discord.com/channels/954736697453731850/954737311843770440/994328694522921030)',
        )
        .setColor('Random')
        .setThumbnail(cfg.thumbnailURL)
        .setImage(imgURL)
        .setTimestamp()
        .setFooter({ text: guild.name, iconURL: guild.iconURL(true) });

      return await interaction.reply({ embeds: [embed] });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
