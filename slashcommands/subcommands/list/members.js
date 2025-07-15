const { Client, Interaction, SlashCommandSubcommandBuilder, Colors } = require('discord.js');

module.exports = {
  category: 'sub command',
  parent: 'list',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('members'),

  /** - Lists members by role.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { options } = interaction;
    const { errorEmbed } = client;
    const role = options.getRole('role');
    const title = options.getString('title') || `Danh sách thành viên ${role}`;
    const isMention = options.getBoolean('mention');
    const inline = options.getBoolean('inline');
    const members = isMention
      ? role.members.map((m) => m.user)
      : role.members.map((m) => m.user.displayName || m.user.username);

    if (members.length > 0)
      await interaction.reply({
        embeds: [
          {
            description: `**${title}**:\n\n` + members.join(inline ? ' | ' : '\n'),
            color: Colors.Blurple,
            footer: { text: `Tổng số: [${members.length}]` },
          },
        ],
      });
    else await interaction.reply(errorEmbed({ desc: 'Could not find members or the role is incorrect.' }));
  },
};
