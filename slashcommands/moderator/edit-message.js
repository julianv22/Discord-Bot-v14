const { SlashCommandBuilder, Client, EmbedBuilder, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('edit-message')
    .setDescription(`Edit Message. ${cfg.adminRole} only`)
    .addStringOption(opt => opt.setName('message-id').setDescription('Message ID').setRequired(true))
    .addStringOption(opt => opt.setName('content').setDescription('Content').setRequired(true)),
  category: 'moderator',
  permissions: PermissionFlagsBits.ManageMessages,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const msgid = options.getString('message-id');
    const content = options.getString('content');
    let msgEdit = await interaction.channel.messages.fetch(msgid).catch(() => undefined);

    if (msgEdit === undefined)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | Message ID \`${msgid}\` is incorrect!` }],
        ephemeral: true,
      });

    if (msgEdit.author.id !== client.user.id)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | This message [\`${msgid}\`](${msgEdit.url}) does not belong to ${client.user}!` }],
        ephemeral: true,
      });

    await msgEdit.edit(content).then(() => {
      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
        .setTitle('\\✅ Edit message successfully!')
        .setDescription(`**Message ID:** [\`${msgid}\`](${msgEdit.url})`)
        .setColor('Green')
        .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/154/memo_1f4dd.png')
        .addFields([{ name: 'Edit content:', value: '> ' + content }])
        .setTimestamp()
        .setFooter({ text: `Edited by ${user.username}`, iconURL: user.displayAvatarURL(true) });

      interaction.reply({ embeds: [embed], ephemeral: true });
    });
  },
};
