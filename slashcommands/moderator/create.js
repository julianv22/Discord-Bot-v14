const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');
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

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('`💬Title` Enter the embed title')
      .setDescription('`💬Description` Enter the embed description\n\n`🎨Color` Enter the embed color')
      .setColor('Random')
      .setTimestamp()
      .setFooter({ text: `Sent by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });

    await interaction.reply({ content: guildeContent, embeds: [embed], components: [row1, row2], flags: 64 });
  },
};
