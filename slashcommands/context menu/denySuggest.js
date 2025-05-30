const {
  ContextMenuCommandBuilder,
  Client,
  Interaction,
  ApplicationCommandType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');
module.exports = {
  category: 'context menu',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new ContextMenuCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('Deny Suggest')
    .setType(ApplicationCommandType.Message),
  /**
   * Deny suggestion
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { targetMessage: msg, user, guild } = interaction;
    const { errorEmbed, users, user: bot } = client;

    if (msg.author.id !== cfg.clientID)
      return await interaction.reply(
        errorEmbed({ description: `This messages does not belong to ${bot}!`, emoji: false }),
      );

    const embed = msg.embeds[0];

    if (!embed)
      return await interaction.reply(errorEmbed({ description: 'This is not suggest message!', emoji: false }));

    if (embed.title !== `Suggest's content:`)
      return await interaction.reply(errorEmbed({ description: 'This is not suggest message!', emoji: false }));

    const edit = EmbedBuilder.from(embed).setColor('Red').spliceFields(0, 1).setTimestamp().setFooter({
      text: `Đề xuất không được chấp nhận`,
      iconURL: 'https://cdn3.emoji.gg/emojis/5601-x-mark.gif',
    });
    await msg.edit({ embeds: [edit] });

    await interaction.reply(
      errorEmbed({
        description: `Suggestion has been denied! [[Jump Link](${msg.url})]`,
        emoji: `\\🚫 | `,
        color: 'Red',
      }),
    );

    const author = users.cache.find((u) => u.tag === embed.author.name.split(`'s`)[0]);
    if (!author)
      return await interaction.followUp?.(errorEmbed({ description: 'Không tìm thấy user để gửi DM!', emoji: false }));

    author
      .send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: 'Deny suggestion',
              iconURL: 'https://cdn3.emoji.gg/emojis/5601-x-mark.gif',
            })
            .setTitle(`Your suggestion has been denied by ${user.displayName || user.username}!`)
            .setDescription(`[Jump Link](${msg.url})`)
            .setColor('Red')
            .setThumbnail(user.displayAvatarURL(true))
            .setTimestamp()
            .setFooter({ text: guild.name, iconURL: guild.iconURL(true) }),
        ],
      })
      .catch((e) => {
        console.error(chalk.red('Error (Context menu/Deny Suggest):', e));
        return interaction.reply(
          errorEmbed({ title: `\\❌ | Error while running context menu: Deny Suggest`, description: e, color: 'Red' }),
        );
      });
  },
};
