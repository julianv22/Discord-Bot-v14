const { SlashCommandBuilder, Interaction, Client, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { embedButtons } = require('../../functions/common/manage-embed');
module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  data: new SlashCommandBuilder()
    .setName('edit-embed')
    .setDescription(`Edit Embed by message id. ${cfg.modRole} only`)
    .addStringOption((opt) =>
      opt.setName('message_id').setDescription('ID of message containing embed').setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  /**
   * Edit/Create Embed
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const {
      options,
      channel: { messages },
    } = interaction;
    const messageId = options.getString('message_id');
    let msg;
    try {
      msg = await messages.fetch(messageId);
    } catch {
      return interaction.reply(
        errorEmbed({ description: 'Không tìm thấy message, hoặc message không nằm trong channel này!', emoji: false }),
      );
    }
    if (!msg.embeds.length)
      return interaction.reply(errorEmbed({ description: 'Message này không có embed!', emoji: false }));
    const msgEmbed = EmbedBuilder.from(msg.embeds[0]);
    const [row1, row2] = embedButtons(messageId);
    await interaction.reply({
      embeds: [msgEmbed],
      components: [row1, row2],
      flags: 64,
    });
  },
};
