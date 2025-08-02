const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { linkButton } = require('../../functions/common/components');
const { logError, embedMessage } = require('../../functions/common/logging');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription(`Fetches the JSON source from an embed message. ${cfg.modRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('source')
        .setDescription(`Fetches the JSON source of an embed. ${cfg.modRole} only`)
        .addStringOption((opt) =>
          opt
            .setName('message_id')
            .setDescription('Enter the ID of the embed message you want to fetch JSON source from')
            .setRequired(true)
        )
    ),
  /** - Fetches the JSON source of an embed message.
   * @param {Interaction} interaction - The command interaction.
   * @param {Client} client - The Discord client. */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 64 });

    const { user, channel, options } = interaction;
    const { messages } = channel;
    const messageId = options.getString('message_id');

    const targetMessage = await messages.fetch(messageId).catch((e) =>
      logError(
        {
          todo: 'fetching message with ID:',
          item: messageId,
          desc: `in channel ${chalk.yellow(interaction.channel.name)}`,
        },
        e
      )
    );

    if (!targetMessage)
      return await interaction.editReply(
        embedMessage({
          desc: `Message with ID: [${messageId}] not found, or it's not in this channel!`,
        })
      );

    if (targetMessage.author.id !== client.user.id)
      return await interaction.editReply(embedMessage({ desc: `This message does not belong to bot!` }));

    const embedsSource = EmbedBuilder.from(targetMessage.embeds[0]);
    if (!embedsSource)
      return interaction.editReply(embedMessage({ desc: 'This message does not contain any embeds!' }));

    const jsonSource = JSON.stringify(embedsSource, null, 2);
    if (jsonSource.length > 4000) jsonSource.slice(0, 3995) + '...';

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGreen)
        .setAuthor({
          name: `Embed source from message [${messageId}]`,
          iconURL: cfg.book_gif,
          url: targetMessage.url,
        })
        .setDescription(`\`\`\`json\n${jsonSource}\`\`\``)
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp(),
    ];

    await interaction.editReply({ embeds, components: [linkButton(targetMessage.url)] });
  },
};
