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

    const edit = EmbedBuilder.from(embed).setColor('Red').spliceFields(0, 1).setTimestamp().setFooter({
      text: `Đề xuất không được chấp nhận`,
      iconURL: 'https://emoji-uc.akamaized.net/orig/91/688d0305a605a283b2e17e04834192.png',
    });
    await msg.edit({ embeds: [edit] });

    interaction.reply({
      embeds: [
        {
          color: 16711680,
          description: `\\🚫 | Suggestion has been denied! [[Jump Link](${msg.url})]`,
        },
      ],
      ephemeral: true,
    });

    const author = users.cache.find((u) => u.tag === embed.author.name.split(`'s`)[0]);

    author
      .send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: 'Deny suggestion',
              iconURL: 'https://emoji-uc.akamaized.net/orig/91/688d0305a605a283b2e17e04834192.png',
            })
            .setTitle(`Your suggestion has been denied by ${user.displayName}!`)
            .setDescription(`[Jump Link](${msg.url})`)
            .setColor('Red')
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
