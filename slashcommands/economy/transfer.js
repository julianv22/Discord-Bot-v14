const {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const economyProfile = require('../../config/economyProfile');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer 💲 to other users')
    .addUserOption((opt) => opt.setName('target').setDescription('Target user').setRequired(true))
    .addIntegerOption((opt) => opt.setName('amount').setDescription('Amount of 💲 to transfer').setRequired(true)),
  /**
   * Transfer 💲 to other users
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { user, guild, options } = interaction;
    const { errorEmbed, catchError } = client;
    const [targetUser, amount] = [options.getUser('target'), options.getInteger('amount')];

    if (targetUser.bot)
      return await interaction.reply(errorEmbed({ desc: 'Bạn không thể chuyển \\💲 cho bot!', emoji: false }));
    if (targetUser.id === user.id)
      return await interaction.reply(errorEmbed({ desc: 'Bạn không thể chuyển \\💲 cho chính mình!', emoji: false }));

    try {
      let [profile, targetProfile] = await Promise.all([
        await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error),
        await economyProfile.findOne({ guildID: guild.id, userID: targetUser.id }).catch(console.error),
      ]);

      if (!profile || !targetProfile)
        return await interaction.reply(
          errorEmbed({
            description: !profile
              ? 'Bạn chưa có tài khoản Economy, vui lòng sử dụng lệnh `/daily` để tạo tài khoản'
              : 'Đối tượng chuyển \\💲 chưa có tài khoản Economy',
            emoji: false,
          }),
        );
      if (amount < 99 || amount > profile.bank)
        return await interaction.reply(
          errorEmbed({
            description: amount < 99 ? 'Số \\💲 phải tối thiểu là 100\\💲' : 'Bạn không có đủ \\💲 để chuyển!',
            emoji: false,
          }),
        );
      const fee = Math.round(amount * 0.01);
      const total = amount + fee;
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${guild.name} Economy Transfer`, iconURL: guild.iconURL(true) })
        .setTitle(`Hiện có ${profile.bank.toLocaleString()}\\💲 trong tài khoản \\🏦 của bạn`)
        .setDescription(
          `❗Thao tác này sẽ thực hiện với tài khoản bank\\🏦 của bạn chứ không phải tài khoản trong túi tiền\\💰.\n\n❗ Chuyển ${amount.toLocaleString()}\\💲 từ tài khoản của bạn sang tài khoản của ${targetUser}.\n\n❗ Hệ thống sẽ tính phí 1% với số tiền cần chuyển, bạn sẽ phải trả số tiền là ${total}\\💲.\n\n❗ Bạn có muốn tiếp tục?`,
        )
        .setColor('Random')
        .setTimestamp()
        .setThumbnail(cfg.economyPNG)
        .setFooter({
          text: `Requested bye ${user.displayName || user.username}`,
          iconURL: user.displayAvatarURL(true),
        });

      const buttons = [
        {
          customId: `transfer-btn:${amount}:${fee}:${targetUser.id}`,
          label: 'Transfer',
          style: ButtonStyle.Success,
        },
        {
          customId: 'transfer-btn:cancel',
          label: 'Cancel',
          style: ButtonStyle.Danger,
        },
      ];

      return await interaction.reply({
        embeds: [embed],
        components: [
          new ActionRowBuilder().addComponents(
            buttons.map((data) =>
              new ButtonBuilder().setCustomId(data.customId).setLabel(data.label).setStyle(data.style),
            ),
          ),
        ],
        flags: 64,
      });
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
