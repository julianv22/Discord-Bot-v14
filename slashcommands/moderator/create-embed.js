const {
  Client,
  Interaction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require('discord.js');
const { setRowComponent } = require('../../functions/common/components');
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
    const createEmbed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('Enter the embed title')
      .setDescription('Enter the embed description')
      .setColor('Random')
      .setTimestamp()
      .setFooter({ text: `Sent by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });
    const button1 = [
      { customId: 'manage-embed-btn:title', label: '💬Title', style: ButtonStyle.Primary },
      { customId: 'manage-embed-btn:description', label: '💬Description', style: ButtonStyle.Primary },
      { customId: 'manage-embed-btn:color', label: '🎨Color', style: ButtonStyle.Primary },
      { customId: 'manage-embed-btn:thumbnail', label: '🖼️Thumbnail', style: ButtonStyle.Secondary },
      { customId: 'manage-embed-btn:image', label: '🖼️Image', style: ButtonStyle.Secondary },
    ];
    const button2 = [
      { customId: 'manage-embed-btn:footer', label: '⛔DisableFooter', style: ButtonStyle.Danger },
      { customId: 'manage-embed-btn:timestamp', label: '⛔Disable Timestamp', style: ButtonStyle.Danger },
      { customId: 'manage-embed-btn:send', label: '✅Send Embed', style: ButtonStyle.Success },
    ];
    let guildeContent = `Danh sách màu sắc: \`\`\`'Red', 'Blue', 'Green', 'Yellow', 'LuminousVividPink', 'Fuchsia', 'Gold', 'Orange', 'Purple', 'DarkAqua', 'DarkGreen', 'DarkBlue', 'DarkPurple', 'DarkVividPink', 'DarkGold', 'DarkOrange', 'DarkRed', 'DarkGrey', 'Navy', 'Aqua', 'Blurple', 'Greyple', 'DarkButNotBlack', 'NotQuiteBlack', 'White', 'Default', 'Random'\`\`\`\n`;
    guildeContent += `Click vào \`⛔Disable Footer\` để tắt footer, sau đó \`✅Enable Footer\` để thể thiết lập footer mới.\nCác biến có thể dùng: \`{user}\`: tên user.    |    \`{avatar}\`: avatar của user.`;
    await interaction.reply({
      content: guildeContent,
      embeds: [createEmbed],
      components: [
        new ActionRowBuilder().addComponents(setRowComponent(button1, ComponentType.Button)),
        new ActionRowBuilder().addComponents(setRowComponent(button2, ComponentType.Button)),
      ],
      ephemeral: true,
    });
  },
};
