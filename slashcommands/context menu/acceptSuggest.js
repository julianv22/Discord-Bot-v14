const {
  Client,
  Interaction,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new ContextMenuCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('Accept Suggestion')
    .setType(ApplicationCommandType.Message),
  /** - Accepts a suggestion.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { targetMessage: msg, user, guild } = interaction;
    const { errorEmbed, catchError, users } = client;

    if (msg.author.id !== cfg.clientID)
      return await interaction.reply(errorEmbed({ desc: 'This is not a message from me!' }));

    const embed = msg.embeds[0];

    if (!embed || embed.title !== "Suggest's content:")
      return await interaction.reply(errorEmbed({ desc: 'This is not a suggestion message!' }));

    const edit = EmbedBuilder.from(embed).setColor(Colors.Green).spliceFields(0, 1).setTimestamp().setFooter({
      text: 'Suggestion accepted',
      iconURL: 'https://cdn3.emoji.gg/emojis/4240-verified-green-animated.gif',
    });

    await msg.edit({ embeds: [edit] });

    await interaction.reply(
      errorEmbed({ desc: `Suggestion has been accepted! [[Jump Link](${msg.url}]`, emoji: true })
    );

    const author = users.cache.find((u) => u.tag === embed.author.name.split(`'s`)[0]);

    if (!author) return interaction.followUp(errorEmbed({ desc: 'Could not find user to send DM!' }));

    await author
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Green)
            .setThumbnail(user.displayAvatarURL(true))
            .setAuthor({
              name: 'Accept suggestion',
              iconURL: 'https://cdn3.emoji.gg/emojis/4240-verified-green-animated.gif',
            })
            .setTitle(`Your suggestion has been accepted by ${user.displayName || user.username}!`)
            .setDescription(`[Jump Link](${msg.url})`)
            .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
            .setTimestamp(),
        ],
      })
      .catch((e) => {
        return catchError(interaction, e, this);
      });
  },
};
