const {
  Client,
  Interaction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  Colors,
} = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const { rowComponents } = require('../../functions/common/components');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer 💲 to other users.')
    .addUserOption((opt) =>
      opt.setName('target').setDescription('The user to whom you want to transfer 💲.').setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt.setName('amount').setMinValue(500).setDescription('The amount of 💲 to transfer.').setRequired(true)
    ),
  /** - Transfer 💲 to other users
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, guildId, user, options } = interaction;
    const { errorEmbed } = client;
    const [target, amount] = [options.getUser('target'), options.getInteger('amount')];

    if (target.bot) return await interaction.reply(errorEmbed({ desc: 'Bạn không thể chuyển 💲 cho bot!' }));

    if (target.id === user.id)
      return await interaction.reply(errorEmbed({ desc: 'Bạn không thể chuyển 💲 cho chính mình!' }));

    const [profile, targetProfile] = await Promise.all([
      economyProfile.findOne({ guildId, userId: user.id }).catch(console.error),
      economyProfile
        .findOneAndUpdate(
          { guildId, userId: target.id },
          { guildName: guild.name, userName: target.displayName || target.username, lastWork: '' },
          { upsert: true, new: true }
        )
        .catch(console.error),
    ]);

    if (!profile || !targetProfile)
      return await interaction.reply(
        errorEmbed({
          desc: !profile
            ? 'Bạn chưa có tài khoản Economy, vui lòng sử dụng lệnh /daily để tạo tài khoản'
            : 'Không tìm thấy tài khoản Economy của người nhận',
        })
      );

    if (amount > profile?.bank) return await interaction.reply(errorEmbed({ desc: 'Bạn không có đủ 💲 để chuyển!' }));

    const fee = Math.round(amount * 0.01);
    const total = amount + fee;

    const buttons = [
      {
        customId: `transfer:${amount}:${fee}:${target.id}`,
        label: 'Transfer',
        style: ButtonStyle.Success,
      },
      { customId: 'transfer:cancel', label: 'Cancel', style: ButtonStyle.Danger },
    ];

    const components = [new ActionRowBuilder().setComponents(rowComponents(ComponentType.Button, buttons))];

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGold)
        .setThumbnail(cfg.economyPNG)
        .setAuthor({
          name: `${guild.name} Economy Transfer`,
          iconURL: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f4b8/512.gif',
        })
        .setTitle(`Hiện có ${profile?.bank.toCurrency()} trong tài khoản \\🏦 của bạn`)
        .setDescription(
          `❗Thao tác này sẽ thực hiện với tài khoản bank\\🏦 của bạn chứ không phải tài khoản trong túi tiền\\💰.\n\n❗ Chuyển ${amount.toCurrency()} từ tài khoản của bạn sang tài khoản của ${target}.\n\n❗ Hệ thống sẽ tính phí 1% với số tiền cần chuyển, bạn sẽ phải trả số tiền là ${total.toCurrency()}.\n\n❗ Bạn có muốn tiếp tục?`
        )
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp(),
    ];
    return await interaction.reply({ embeds, components, flags: 64 });
  },
};
