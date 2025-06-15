const {
  SlashCommandBuilder,
  Client,
  EmbedBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('edit-message')
    .setDescription(`Edit a message. ${cfg.modRole} only`)
    .addStringOption((opt) => opt.setName('message-id').setDescription('Message ID').setRequired(true))
    .addStringOption((opt) => opt.setName('content').setDescription('Content').setRequired(true)),
  /**
   * Edit a message
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed, catchError } = client;
    const [msgid, content] = [options.getString('message-id'), options.getString('content')];
    let msgEdit = await interaction.channel.messages.fetch(msgid).catch(console.error);

    try {
      if (msgEdit === undefined)
        return await interaction.reply(errorEmbed({ desc: `Message ID \`${msgid}\` is incorrect!`, emoji: false }));

      if (msgEdit.author.id !== client.user.id)
        return await interaction.reply(
          errorEmbed({
            description: `This message [\`${msgid}\`](${msgEdit.url}) does not belong to ${client.user}!`,
            emoji: false,
          }),
        );

      await msgEdit.edit(content).then(async () => {
        const embed = new EmbedBuilder()
          .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
          .setTitle('\\✅ Message edited successfully!')
          .setDescription(`**Message ID:** [\`${msgid}\`](${msgEdit.url})`)
          .setColor(Colors.Green)
          .setThumbnail(
            'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/memo_1f4dd.png',
          )
          .addFields([{ name: 'Edited content:', value: '> ' + content }])
          .setTimestamp()
          .setFooter({
            text: `Edited by ${user.displayName || user.username}`,
            iconURL: user.displayAvatarURL(true),
          });

        return await interaction.reply({ embeds: [embed], flags: 64 });
      });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
