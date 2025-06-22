const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Colors } = require('discord.js');
const { embedButtons } = require('../../functions/common/manage-embed');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('create')
    .setDescription(`Create embed. ${cfg.modRole} only`)
    .addSubcommand((sub) => sub.setName('embed').setDescription('Create an embed')),
  /** - Create a embed
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const [row1, row2] = embedButtons();

    let guildeContent = `Danh sách màu sắc: \`\`\`fix\n${Object.keys(Colors).join(', ')}\`\`\`\n`;
    guildeContent += `Các biến có thể dùng: \`{user}\`: tên user.    |    \`{avatar}\`: avatar của user.    |    \`{guild}\`: tên guild`;

    await interaction.reply({
      content: guildeContent,
      embeds: [
        {
          author: { name: guild.name, iconURL: guild.iconURL(true) },
          title: '`💬Title` Enter the embed title',
          description: '`💬Description` Enter the embed description\n\n`🎨Color` Enter the embed color',
          color: Math.floor(Math.random() * 0xffffff),
          timestamp: new Date(),
          footer: { text: `Sent by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) },
        },
      ],
      components: [row1, row2],
      flags: 64,
    });
  },
};
