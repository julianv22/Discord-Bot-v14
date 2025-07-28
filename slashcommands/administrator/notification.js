const {
  Client,
  Interaction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');
const { rowComponents } = require('../../functions/common/components');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('notification')
    .setDescription(`Sends a notification to users. ${cfg.adminRole} only`),
  /** - Sends a notification to users
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user } = interaction;

    await interaction.deferReply({ flags: 64 });

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.Red)
        .setThumbnail(cfg.notifyPNG)
        .setAuthor({
          name: `${guild.name}'s Notification`,
          iconURL: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f6a8/512.gif',
        })
        .setTitle('Notification title')
        .setDescription('Notification description')
        .setFooter({ text: `Sent by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp(),
    ];

    const button = [
      { customId: `notification:title`, label: '💬 Title', style: ButtonStyle.Primary },
      { customId: `notification:description`, label: '💬 Description', style: ButtonStyle.Primary },
      { customId: `notification:image`, label: '🖼️ Image', style: ButtonStyle.Secondary },
      { customId: `notification:thumbnail`, label: '📢 Type: Notify', style: ButtonStyle.Danger },
      { customId: `notification:send`, label: '✅ Send Notification', style: ButtonStyle.Success },
    ];

    await interaction.editReply({
      embeds,
      components: [new ActionRowBuilder().setComponents(rowComponents(ComponentType.Button, button))],
    });
  },
};
