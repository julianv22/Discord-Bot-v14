const {
  ContextMenuCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandType,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
} = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new ContextMenuCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('Accept Suggest')
    .setType(ApplicationCommandType.Message),
  /** Accept suggestion
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { targetMessage: msg, user, guild } = interaction;
    const { errorEmbed, catchError, users } = client;

    if (msg.author.id !== cfg.clientID)
      return await interaction.reply(errorEmbed({ desc: 'This is not my message!', emoji: false }));

    const embed = msg.embeds[0];

    if (!embed || embed.title !== "Suggest's content:")
      return await interaction.reply(errorEmbed({ desc: 'This is not suggest message!', emoji: false }));

    const edit = EmbedBuilder.from(embed).setColor(Colors.Green).spliceFields(0, 1).setTimestamp().setFooter({
      text: 'Đề xuất đã được chấp nhận',
      iconURL: 'https://cdn3.emoji.gg/emojis/4240-verified-green-animated.gif',
    });
    await msg.edit({ embeds: [edit] });

    await interaction.reply(
      errorEmbed({ desc: `Suggestion has been accepted! [[Jump Link](${msg.url}]`, emoji: true }),
    );

    const author = users.cache.find((u) => u.tag === embed.author.name.split(`'s`)[0]);
    if (!author) return interaction.followUp?.(errorEmbed({ desc: 'Không tìm thấy user để gửi DM!', emoji: false }));

    await author
      .send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: 'Accept suggestion',
              iconURL: 'https://cdn3.emoji.gg/emojis/4240-verified-green-animated.gif',
            })
            .setTitle(`Your suggestion has been accepted by ${user.displayName || user.username}!`)
            .setDescription(`[Jump Link](${msg.url})`)
            .setColor(Colors.Green)
            .setThumbnail(user.displayAvatarURL(true))
            .setTimestamp()
            .setFooter({ text: guild.name, iconURL: guild.iconURL(true) }),
        ],
      })
      .catch((e) => {
        return catchError(interaction, e, this);
      });
  },
};
