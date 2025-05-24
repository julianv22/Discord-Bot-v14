const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { embedButtons } = require('../../functions/common/manage-embed');
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
    const [row1, row2] = embedButtons();
    let guildeContent = `Danh sách màu sắc: \`\`\`'Red', 'Blue', 'Green', 'Yellow', 'LuminousVividPink', 'Fuchsia', 'Gold', 'Orange', 'Purple', 'DarkAqua', 'DarkGreen', 'DarkBlue', 'DarkPurple', 'DarkVividPink', 'DarkGold', 'DarkOrange', 'DarkRed', 'DarkGrey', 'Navy', 'Aqua', 'Blurple', 'Greyple', 'DarkButNotBlack', 'NotQuiteBlack', 'White', 'Default', 'Random'\`\`\`\n`;
    guildeContent += `Các biến có thể dùng: \`{user}\`: tên user.    |    \`{avatar}\`: avatar của user.    |    \`{guild}\`: tên guild`;
    await interaction.reply({
      content: guildeContent,
      embeds: [createEmbed],
      components: [row1, row2],
      flags: 64,
    });
  },
};
