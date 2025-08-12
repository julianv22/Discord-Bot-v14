const { Client, Interaction, SlashCommandSubcommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { embedMessage } = require('../../../functions/common/logging');

module.exports = {
  category: 'sub command',
  parent: 'list',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('members'),

  /** Lists members by role.
   * @param {Interaction} interaction Command Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const { options } = interaction;
    const role = options.getRole('role');
    const title = options.getString('title') || `Danh sách thành viên ${role}`;
    const isMention = options.getBoolean('mention');
    const isInline = options.getBoolean('inline');
    const members = isMention
      ? role.members.map((m) => m.user)
      : role.members.map((m) => m.user.displayName || m.user.username);

    if (members.length === 0)
      return await interaction.reply(embedMessage({ desc: 'Could not find members math the role was given.' }));

    await interaction.deferReply();

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.Blurple)
        .setDescription(`**${title}**:\n\n` + members.join(isInline ? ' | ' : '\n'))
        .setFooter({ text: `Tổng số: [${members.length}]` }),
    ];

    await interaction.editReply({ embeds });
  },
};
