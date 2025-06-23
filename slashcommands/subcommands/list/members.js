const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction, Colors } = require('discord.js');

module.exports = {
  category: 'sub command',
  parent: 'list',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('members'),

  /** - Get members list by role
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { options } = interaction;
    const { errorEmbed, catchError } = client;
    const role = options.getRole('role'),
      title = options.getString('title') || `Danh sách thành viên ${role}`,
      isMention = options.getBoolean('mention'),
      inline = options.getBoolean('inline'),
      members = isMention
        ? role.members.map((m) => m.user)
        : role.members.map((m) => m.user.displayName || m.user.username);

    try {
      if (members.length > 0) {
        await interaction.reply({
          embeds: [
            {
              description: `**${title}**:\n\n` + members.join(inline ? ' | ' : '\n'),
              color: Colors.Blurple,
              footer: { text: `Tổng số: [${members.length}]` },
            },
          ],
        });
      } else {
        await interaction.reply(errorEmbed({ desc: 'Can not find members or role is incorrect!', emoji: false }));
      }
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
