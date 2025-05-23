const economyProfile = require('../../config/economyProfile');
const {
  SlashCommandBuilder,
  Interaction,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer 💲 to other users')
    .addUserOption((opt) => opt.setName('target').setDescription('Target user').setRequired(true))
    .addIntegerOption((opt) => opt.setName('amount').setDescription('Amount of 💲 to transfer').setRequired(true)),
  category: 'economy',
  scooldown: 0,
  /**
   * Transfer 💲 to other users
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user, guild, options } = interaction;
    const targetUser = options.getUser('target');
    const amount = options.getInteger('amount');

    if (targetUser.bot) return await interaction.reply(errorEmbed(true, `Bạn không thể chuyển \\💲 cho bot!`));
    if (targetUser.id === user.id)
      return await interaction.reply(errorEmbed(true, `Bạn không thể chuyển \\💲 cho chính mình!`));

    let [profile, targetProfile] = await Promise.all([
      economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(() => {}),
      economyProfile.findOne({ guildID: guild.id, userID: targetUser.id }).catch(() => {}),
    ]);

    if (!profile || !targetProfile)
      return await interaction.reply(
        errorEmbed(
          true,
          !profile
            ? `Bạn chưa có tài khoản Economy, vui lòng sử dụng lệnh \`/daily\` để tạo tài khoản`
            : `Đối tượng chuyển \\💲 chưa có tài khoản Economy`,
        ),
      );
    if (amount < 99 || amount > profile.bank)
      return await interaction.reply(
        errorEmbed(true, amount < 99 ? `Số \\💲 phải tối thiểu là 100\\💲` : `Bạn không có đủ \\💲 để chuyển!`),
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
      .setFooter({ text: `Requested bye ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });

    const buttons = [
      {
        customId: `transfer-btn:${amount}:${fee}:${targetUser.id}`,
        label: 'Tiếp tục',
        style: ButtonStyle.Success,
        disabled: false,
      },
      {
        customId: 'cancel',
        label: 'Click vào Dismiss để huỷ bỏ',
        style: ButtonStyle.Danger,
        disabled: true,
      },
    ];

    await interaction.reply({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(
          buttons.map((data) =>
            new ButtonBuilder()
              .setCustomId(data.customId)
              .setLabel(data.label)
              .setStyle(data.style)
              .setDisabled(data.disabled),
          ),
        ),
      ],
      flags: 64,
    });
  },
};
