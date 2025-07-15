const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Colors } = require('discord.js');
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
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user } = interaction;

    let content = `Danh sách màu sắc: \`\`\`fix\n${Object.keys(Colors).join(', ')}\`\`\`\n`;
    content += `Các biến có thể dùng: \`{user}\`: tên user.    |    \`{avatar}\`: avatar của user.    |    \`{guild}\`: tên guild`;

    const embeds = [
      new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle('`💬Title` Enter the embed title')
        .setDescription('`💬Description` Enter the embed description\n\n`🎨Color` Enter the embed color')
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: `Sent by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) }),
    ];

    const components = embedButtons();

    await interaction.reply({ content, embeds, components, flags: 64 });
  },
};
