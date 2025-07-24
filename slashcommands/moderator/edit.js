const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { manageEmbedButtons } = require('../../functions/common/manage-embed');
const { linkButton } = require('../../functions/common/components');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('edit')
    .setDescription(`Edit an embed or message. ${cfg.modRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('embed')
        .setDescription(`Edit an embed by message ID. ${cfg.modRole} only`)
        .addStringOption((opt) => opt.setName('message_id').setDescription('Message ID').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('message')
        .setDescription(`Edit a message by message ID. ${cfg.modRole} only`)
        .addStringOption((opt) => opt.setName('message_id').setDescription('Message ID').setRequired(true))
        .addStringOption((opt) => opt.setName('content').setDescription('Content').setRequired(true))
    ),
  /** - Edits an embed or a message.
   * @param {Interaction} interaction - The command interaction.
   * @param {Client} client - The Discord client. */
  async execute(interaction, client) {
    const {
      user,
      options,
      guild,
      channel: { messages },
    } = interaction;
    const { messageEmbed, logError } = client;
    const editType = options.getSubcommand();
    const messageId = options.getString('message_id');
    const content = options.getString('content');

    const msg = await messages.fetch(messageId).catch((e) =>
      logError(
        {
          todo: 'fetching message with ID:',
          item: messageId,
          desc: `in channel ${chalk.yellow(interaction.channel.name)}`,
        },
        e
      )
    );

    if (!msg)
      return await interaction.reply(
        messageEmbed({
          desc: `Message with ID: [${messageId}] not found, or it's not in this channel!`,
        })
      );

    if (msg.author.id !== client.user.id)
      return await interaction.reply(messageEmbed({ desc: `This message does not belong to bot!` }));

    const editMessage = {
      embed: async () => {
        if (!msg.embeds.length)
          return await interaction.reply(messageEmbed({ desc: 'This message does not contain any embeds!' }));

        await interaction.reply({
          embeds: [EmbedBuilder.from(msg.embeds[0])],
          components: manageEmbedButtons(messageId),
          flags: 64,
        });
      }, //'https://images-ext-1.discordapp.net/external/OR2PWu33fjUxkLADQxGqnNDDybM3_1-e4xg8PRyQ6f8/https/maki.gg/emoji/pencil.png'
      message: async () =>
        await msg.edit(content).then(
          async () =>
            await interaction.reply({
              ...messageEmbed({ desc: 'Message has been edited successfully!', emoji: true }),
              components: [linkButton(msg.url)],
            })
        ),
    };

    if (!editMessage[editType]()) throw new Error(chalk.yellow('Invalid subCommand'), chalk.green(editType));
  },
};
