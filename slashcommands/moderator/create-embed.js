const {
  Client,
  Interaction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

const embedColors = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'LuminousVividPink', // Một màu hồng rực rỡ
  'Fuchsia',
  'Gold',
  'Orange',
  'Purple',
  'DarkAqua',
  'DarkGreen',
  'DarkBlue',
  'DarkPurple',
  'DarkVividPink',
  'DarkGold',
  'DarkOrange',
  'DarkRed',
  'DarkGrey', // Còn được gọi là 'DarkGray'
  'Navy',
  'Aqua', // Còn được gọi là 'Cyan'
  'Blurple', // Màu đặc trưng của Discord
  'Greyple',
  'DarkButNotBlack', // Màu xám đậm hơn một chút so với đen
  'NotQuiteBlack', // Màu đen nhưng không hoàn toàn đen
  'White',
  'Default', // Màu mặc định của Discord (xám đen)
  'Random', // Từ khóa "Random" để lấy một màu ngẫu nhiên
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-embed')
    .setDescription(`Create a embed. ${cfg.modRole} only`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  /**
   * Create a embed
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const { getOptions } = client;
    const createEmbed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('Enter the embed title')
      .setDescription('Enter the embed description')
      .setColor('Random')
      .setTimestamp()
      .setFooter({ text: `Sent by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });
    const button1 = [
      { customId: 'create-embed-btn:title', label: '💬Title', style: ButtonStyle.Primary },
      { customId: 'create-embed-btn:description', label: '💬Description', style: ButtonStyle.Primary },
      { customId: 'create-embed-btn:color', label: '🎨Color', style: ButtonStyle.Primary },
      { customId: 'create-embed-btn:thumbnail', label: '🖼️Thumbnail', style: ButtonStyle.Secondary },
      { customId: 'create-embed-btn:image', label: '🖼️Image', style: ButtonStyle.Secondary },
    ];
    const button2 = [
      { customId: 'create-embed-btn:footer', label: '⛔DisableFooter', style: ButtonStyle.Danger },
      { customId: 'create-embed-btn:timestamp', label: '⛔Disable Timestamp', style: ButtonStyle.Danger },
      { customId: 'create-embed-btn:send', label: '✅Send Embed', style: ButtonStyle.Success },
    ];
    await interaction.reply({
      embeds: [createEmbed],
      components: [
        new ActionRowBuilder().addComponents(getOptions(button1, ComponentType.Button)),
        new ActionRowBuilder().addComponents(getOptions(button2, ComponentType.Button)),
      ],
      ephemeral: true,
    });
  },
};
