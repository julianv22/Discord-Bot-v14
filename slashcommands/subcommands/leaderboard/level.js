const { SlashCommandSubcommandBuilder, Client, Interaction, EmbedBuilder } = require('discord.js');
const { checkURL } = require('../../../functions/common/utilities');
module.exports = {
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('level'),
  /**
   * Get level leaderboard
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, options } = interaction;
    const week = options.getInteger('week');
    const imgURL = options.getString('image');

    try {
      if (!checkURL(imgURL))
        return await interaction.reply(errorEmbed({ description: 'Vui lòng nhập chính xác Image URL', emoji: false }));

      const embed = new EmbedBuilder()
        .setAuthor({ name: '🏆 Level Leaderboard', iconURL: user.displayAvatarURL(true) })
        .setTitle('Bảng xếp hạng level tuần #' + week)
        .setDescription(
          'Xem bảng xếp hạng trên 10? [View top 100](https://arcane.bot/leaderboard/954736697453731850)\n\nXem [Rank List](https://discord.com/channels/954736697453731850/954737311843770440/994328694522921030)',
        )
        .setColor('Random')
        .setThumbnail(cfg.thumbnailURL)
        .setImage(imgURL)
        .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
        .setTimestamp();

      return await interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.error(chalk.red('Error while executing /leaderboard level command', e));
      return await interaction.reply(
        errorEmbed({ title: `\\❌ Error while executing /leaderboard level command`, description: e, color: 'Red' }),
      );
    }
  },
};
