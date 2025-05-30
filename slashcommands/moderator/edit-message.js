const { SlashCommandBuilder, Client, EmbedBuilder, Interaction, PermissionFlagsBits } = require('discord.js');
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
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, options } = interaction;
    const msgid = options.getString('message-id');
    const content = options.getString('content');
    let msgEdit = await interaction.channel.messages.fetch(msgid).catch(() => undefined);

    try {
      if (msgEdit === undefined)
        return await interaction.reply(
          errorEmbed({ description: `Message ID \`${msgid}\` is incorrect!`, emoji: false }),
        );

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
          .setTitle('✅ Message edited successfully!')
          .setDescription(`**Message ID:** [\`${msgid}\`](${msgEdit.url})`)
          .setColor('Green')
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
      console.error(chalk.red('Error while executing /edit-message command', e));
      return await interaction.reply(
        errorEmbed({ title: `\\❌ | Error while executing /edit-message command`, description: e, color: 'Red' }),
      );
    }
  },
};
