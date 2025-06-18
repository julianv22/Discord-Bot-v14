const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
} = require('discord.js');
const { embedButtons } = require('../../functions/common/manage-embed');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('edit')
    .setDescription(`Edit embed or be messageId. ${cfg.modRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('embed')
        .setDescription('Edit embed by messageId')
        .addStringOption((opt) => opt.setName('message_id').setDescription('Message Id').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('message')
        .setDescription('Edit message by messageId')
        .addStringOption((opt) => opt.setName('message_id').setDescription('Message Id').setRequired(true))
        .addStringOption((opt) => opt.setName('content').setDescription('Content').setRequired(true)),
    ),
  /**
   * Edit/Create Embed
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const {
      user,
      options,
      guild,
      channel: { messages },
    } = interaction;
    const { errorEmbed, user: bot } = client;
    const editType = options.getSubcommand();
    const messageId = options.getString('message_id');
    const content = options.getString('content');

    const msg = await messages.fetch(messageId).catch(async () => {
      return await interaction.reply(
        errorEmbed({
          des: `Không tìm thấy message với id: [\`${messageId}\`], hoặc message không nằm trong channel này!`,
          emoji: false,
        }),
      );
    });

    if (msg.author.id !== bot.id)
      return await interaction.reply(errorEmbed({ desc: `Message này không phải của ${bot}!`, emoji: false }));

    const editMessage = {
      embed: async () => {
        if (!msg.embeds.length)
          return await interaction.reply(errorEmbed({ desc: 'Message này không có embed!', emoji: false }));

        const msgEmbed = EmbedBuilder.from(msg.embeds[0]);
        const [row1, row2] = embedButtons(messageId);

        return await interaction.reply({
          embeds: [msgEmbed],
          components: [row1, row2],
          flags: 64,
        });
      },
      message: async () => {
        return await msg.edit(content).then(async () => {
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setAuthor({ name: guild.name, icon_url: guild.iconURL(true) })
                .setTitle('\\✅ Message edited successfully!')
                .setDescription(`**Message ID:** [\`${msg.id}\`](${msg.url})`)
                .setColor(Colors.Green)
                .setThumbnail(
                  'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/memo_1f4dd.png',
                )
                .addFields([{ name: 'Edited content:', value: '> ' + content }])
                .setTimestamp()
                .setFooter({
                  text: `Edited by ${user.displayName || user.username}`,
                  iconURL: user.displayAvatarURL(true),
                }),
            ],
            flags: 64,
          });
        });
      },
    };

    if (!editMessage[editType]) throw new Error(chalk.yellow('Invalid subCommand ') + chalk.green(editType));
    else await editMessage[editType]();
  },
};
