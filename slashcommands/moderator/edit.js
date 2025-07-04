const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const { embedButtons } = require('../../functions/common/manage-embed');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('edit')
    .setDescription(`Edit embed or message. ${cfg.modRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('embed')
        .setDescription('Edit an embed by message ID')
        .addStringOption((opt) => opt.setName('message_id').setDescription('Message ID').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('message')
        .setDescription('Edit a message by message ID')
        .addStringOption((opt) => opt.setName('message_id').setDescription('Message ID').setRequired(true))
        .addStringOption((opt) => opt.setName('content').setDescription('Content').setRequired(true))
    ),
  /** - Create/edit embed or message
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const {
      user,
      options,
      guild,
      channel: { messages },
    } = interaction;
    const { errorEmbed } = client;
    const editType = options.getSubcommand();
    const messageId = options.getString('message_id');
    const content = options.getString('content');
    const msg = await messages.fetch(messageId).catch(async () => {
      return await interaction.reply(
        errorEmbed({
          desc: `Không tìm thấy message với id: [\`${messageId}\`], hoặc message không nằm trong channel này!`,
          emoji: false,
        })
      );
    });

    if (msg.author.id !== client.user.id)
      return await interaction.reply(errorEmbed({ desc: `Message này không phải của ${client.user}!` }));

    const editMessage = {
      embed: async () => {
        if (!msg.embeds.length) return await interaction.reply(errorEmbed({ desc: 'Message này không có embed!' }));

        const msgEmbed = EmbedBuilder.from(msg.embeds[0]);
        const [row1, row2] = embedButtons(messageId);

        return await interaction.reply({ embeds: [msgEmbed], components: [row1, row2], flags: 64 });
      },
      message: async () => {
        return await msg.edit(content).then(async () => {
          const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
            .setTitle('\\✅ Message edited successfully!')
            .setDescription(`**Message ID:** [\`${msg.id}\`](${msg.url})`)
            .setColor('Random')
            .setThumbnail(
              'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/memo_1f4dd.png'
            )
            .setTimestamp()
            .setFooter({
              text: `Edited by ${user.displayName || user.username}`,
              iconURL: user.displayAvatarURL(true),
            });

          await interaction.reply({ embeds: [embed], flags: 64 });
        });
      },
    };

    if (!editMessage[editType]) throw new Error(chalk.yellow('Invalid subCommand ') + chalk.green(editType));

    await editMessage[editType]();
  },
};
