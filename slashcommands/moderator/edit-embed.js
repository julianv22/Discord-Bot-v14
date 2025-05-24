const {
  SlashCommandBuilder,
  Interaction,
  Client,
  PermissionFlagsBits,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ComponentType,
} = require('discord.js');
const { setRowComponent } = require('../../functions/common/components');
const { getEmbedButtons } = require('../../functions/common/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('edit-embed')
    .setDescription(`Edit Embed by message id. ${cfg.modRole} only`)
    .addStringOption((opt) =>
      opt.setName('message_id').setDescription('ID of message containing embed').setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  /**
   * Edit/Create Embed
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, channel } = interaction;
    const messageId = options.getString('message_id');
    let msg;
    try {
      msg = await channel.messages.fetch(messageId);
    } catch {
      return interaction.reply(errorEmbed(true, 'Không tìm thấy message!'));
    }
    if (!msg.embeds.length) return interaction.reply(errorEmbed(true, 'Message này không có embed!'));

    // Tái sử dụng hàm tạo button
    const [row1, row2] = getEmbedButtons(setRowComponent, ComponentType, true);

    await interaction.reply({
      content: 'Bạn có thể chỉnh sửa embed này:',
      embeds: [EmbedBuilder.from(msg.embeds[0])],
      components: [row1, row2],
      ephemeral: true,
    });
  },
};
