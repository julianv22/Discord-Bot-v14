const {
  ContextMenuCommandBuilder,
  Client,
  Interaction,
  ApplicationCommandType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName("Accept Suggest")
    .setType(ApplicationCommandType.Message),
  category: "context menu",
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { targetMessage: msg, user, guild } = interaction;
    const { users, user: bot } = client;

    if (msg.author.id !== cfg.clientID)
      return interaction.reply({
        embeds: [
          {
            color: 16711680,
            description: `\\❌ | This messages does not belong to ${bot}!`,
          },
        ],
        ephemeral: true,
      });

    const embed = msg.embeds[0];

    if (!embed)
      return interaction.reply({
        embeds: [
          {
            color: 16711680,
            description: `\\❌ | This is not suggest message!`,
          },
        ],
        ephemeral: true,
      });

    if (embed.title !== `Suggest's content:`)
      return interaction.reply({
        embeds: [
          {
            color: 16711680,
            description: `\\❌ | This is not suggest message!`,
          },
        ],
        ephemeral: true,
      });

    const edit = EmbedBuilder.from(embed)
      .setColor("Green")
      .spliceFields(0, 1)
      .setTimestamp()
      .setFooter({
        text: `Đề xuất đã được chấp nhận`,
        iconURL:
          "https://cdn3.emoji.gg/emojis/4240-verified-green-animated.gif",
      });
    await msg.edit({ embeds: [edit] });

    interaction.reply({
      embeds: [
        {
          color: 65280,
          description: `\\✅ | Suggestion has been accepted! [[Jump Link](${msg.url})]`,
        },
      ],
      ephemeral: true,
    });

    const author = users.cache.find(
      (u) => u.tag === embed.author.name.split(`'s`)[0]
    );

    author
      .send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: "Accept suggestion",
              iconURL:
                "https://cdn3.emoji.gg/emojis/4240-verified-green-animated.gif",
            })
            .setTitle(`Your suggestion has been accepted by ${user.username}!`)
            .setDescription(`[Jump Link](${msg.url})`)
            .setColor("Green")
            .setThumbnail(user.displayAvatarURL(true))
            .setTimestamp()
            .setFooter({ text: guild.name, iconURL: guild.iconURL(true) }),
        ],
      })
      .catch((e) => {
        return console.error(e);
      });
  },
};
