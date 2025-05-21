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
    .setName('Deny Suggest')
    .setType(ApplicationCommandType.Message),
  category: 'context menu',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { targetMessage: msg, user, guild } = interaction;
    const { errorEmbed, users, user: bot } = client;

    if (msg.author.id !== cfg.clientID)
      return interaction.reply(errorEmbed(true, `This messages does not belong to ${bot}!`));

    const embed = msg.embeds[0];

    if (!embed) return interaction.reply(errorEmbed(true, 'This is not suggest message!'));

    if (embed.title !== `Suggest's content:`)
      return interaction.reply(errorEmbed(true, 'This is not suggest message!'));

    const edit = EmbedBuilder.from(embed).setColor('Red').spliceFields(0, 1).setTimestamp().setFooter({
      text: `Đề xuất không được chấp nhận`,
      iconURL: 'https://cdn3.emoji.gg/emojis/5601-x-mark.gif',
    });
    await msg.edit({ embeds: [edit] });

    await interaction.reply(errorEmbed(`\\🚫 | `, `Suggestion has been denied! [[Jump Link](${msg.url})]`));

    const author = users.cache.find((u) => u.tag === embed.author.name.split(`'s`)[0]);
    if (!author) return interaction.followUp?.(errorEmbed(true, 'Không tìm thấy user để gửi DM!')).catch(() => {});

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
        return console.error(chalk.red('Error (Context menu/Deny Suggest):', e));
      });
  },
};
