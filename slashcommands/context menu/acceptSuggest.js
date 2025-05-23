const {
  ContextMenuCommandBuilder,
  Client,
  Interaction,
  ApplicationCommandType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('Accept Suggest')
    .setType(ApplicationCommandType.Message),
  category: 'context menu',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  /**
   * Accept suggestion
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { targetMessage: msg, user, guild } = interaction;
    const { errorEmbed, users, user: bot } = client;

    if (msg.author.id !== cfg.clientID)
      return await interaction.reply(errorEmbed(true, `\\❌ | This is not my message!`));

    const embed = msg.embeds[0];

    if (!embed) return await interaction.reply(errorEmbed(true, `\\❌ | This is not suggest message!`));

    if (embed.title !== `Suggest's content:`)
      return await interaction.reply(errorEmbed(true, `\\❌ | This is not suggest message!`));

    const edit = EmbedBuilder.from(embed).setColor('Green').spliceFields(0, 1).setTimestamp().setFooter({
      text: `Đề xuất đã được chấp nhận`,
      iconURL: 'https://cdn3.emoji.gg/emojis/4240-verified-green-animated.gif',
    });
    await msg.edit({ embeds: [edit] });

    await interaction.reply(errorEmbed(false, `Suggestion has been accepted! [[Jump Link](${msg.url}]`));

    const author = users.cache.find((u) => u.tag === embed.author.name.split(`'s`)[0]);
    if (!author) return interaction.followUp?.(errorEmbed(true, 'Không tìm thấy user để gửi DM!')).catch(() => {});

    author
      .send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: 'Accept suggestion',
              iconURL: 'https://cdn3.emoji.gg/emojis/4240-verified-green-animated.gif',
            })
            .setTitle(`Your suggestion has been accepted by ${user.displayName || user.username}!`)
            .setDescription(`[Jump Link](${msg.url})`)
            .setColor('Green')
            .setThumbnail(user.displayAvatarURL(true))
            .setTimestamp()
            .setFooter({ text: guild.name, iconURL: guild.iconURL(true) }),
        ],
      })
      .catch((e) => {
        return console.error(chalk.red('Error (Context menu/Accept Suggest):', e));
      });
  },
};
