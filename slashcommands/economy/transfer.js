const economyProfile = require('../../config/economyProfile');
const {
  SlashCommandBuilder,
  Interaction,
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

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user, guild, options } = interaction;
    const targetUser = options.getUser('target');
    const amount = options.getInteger('amount');

    if (targetUser.bot) return interaction.reply(errorEmbed(true, `Bạn không thể chuyển \\💲 cho bot!`));
    if (targetUser.id === user.id)
      return interaction.reply(errorEmbed(true, `Bạn không thể chuyển \\💲 cho chính mình!`));

    let [profile, targetProfile] = await Promise.all([
      economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(() => {}),
      economyProfile.findOne({ guildID: guild.id, userID: targetUser.id }).catch(() => {}),
    ]);

    if (!profile || !targetProfile)
      return interaction.reply(
        errorEmbed(
          true,
          !profile
            ? `Bạn chưa có tài khoản Economy, vui lòng sử dụng lệnh \`/daily\` để tạo tài khoản`
            : `Đối tượng chuyển \\💲 chưa có tài khoản Economy`,
        ),
      );
    if (amount < 99 || amount > profile.bank)
      return interaction.reply(
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

    await interaction.reply({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setCustomId(`transferbtn:${amount}:${fee}:${targetUser.id}`)
            .setLabel('Tiếp tục')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Click vào Dismiss để huỷ bỏ')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true),
        ]),
      ],
      ephemeral: true,
    });
  },
};
