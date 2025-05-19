const { SlashCommandBuilder, Client, EmbedBuilder, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('edit-message')
    .setDescription(`Edit Message. ${cfg.modRole} only`)
    .addStringOption((opt) => opt.setName('message-id').setDescription('Message ID').setRequired(true))
    .addStringOption((opt) => opt.setName('content').setDescription('Content').setRequired(true)),
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, options } = interaction;
    const msgid = options.getString('message-id');
    const content = options.getString('content');
    let msgEdit = await interaction.channel.messages.fetch(msgid).catch(() => undefined);

    try {
      if (msgEdit === undefined) return interaction.reply(errorEmbed(true, `Message ID \`${msgid}\` is incorrect!`));

      if (msgEdit.author.id !== client.user.id)
        return interaction.reply(
          errorEmbed(true, `This message [\`${msgid}\`](${msgEdit.url}) does not belong to ${client.user}!`),
        );

      await msgEdit.edit(content).then(() => {
        const embed = new EmbedBuilder()
          .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
          .setTitle('\\✅ Edit message successfully!')
          .setDescription(`**Message ID:** [\`${msgid}\`](${msgEdit.url})`)
          .setColor('Green')
          .setThumbnail(
            'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/memo_1f4dd.png',
          )
          .addFields([{ name: 'Edited content:', value: '> ' + content }])
          .setTimestamp()
          .setFooter({
            text: `Edited by ${user.displayName}`,
            iconURL: user.displayAvatarURL(true),
          });

        interaction.reply({ embeds: [embed], ephemeral: true });
      });
    } catch (e) {
      console.error(chalk.yellow.bold('Error (/edit-message):', e));
      return interaction.reply(errorEmbed(true, 'Edit message error:', e));
    }
  },
};
