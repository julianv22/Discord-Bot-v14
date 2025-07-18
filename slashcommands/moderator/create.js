const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Colors } = require('discord.js');
const { manageEmbedButtons } = require('../../functions/common/manage-embed');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('create')
    .setDescription(`Create embed. ${cfg.modRole} only`)
    .addSubcommand((sub) => sub.setName('embed').setDescription('Create an embed')),
  /** - Create a embed
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user } = interaction;

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setFooter({ text: `Sent by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp()
        .setFields(
          { name: '\\💬 Title', value: '-# Enter the embed title', inline: true },
          { name: '\\💬 Description', value: '-# Enter the embed description', inline: true },
          { name: '\\🎨 Color', value: `\`\`\`fix\n${Object.keys(Colors).join(', ')}\`\`\`` },
          { name: '`{user}`', value: '-# User name\n**`{avatar}`**\n-# User avatar', inline: true },
          { name: '`{guild}`', value: '-# Guild name\n**`{iconURL}`**\n-# Guild iconURL', inline: true }
        ),
    ];

    await interaction.reply({ embeds, components: manageEmbedButtons(), flags: 64 });
  },
};
