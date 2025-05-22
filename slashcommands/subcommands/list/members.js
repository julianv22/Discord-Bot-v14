const { SlashCommandSubcommandBuilder, EmbedBuilder, PermissionFlagsBits, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('members'),
  category: 'sub command',
  parent: 'list',
  scooldown: 0,
  /**
   * Get members of a role
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options } = interaction;
    const isMod = interaction.member.permissions.has(PermissionFlagsBits.ManageMessages);

    try {
      if (!isMod)
        return interaction.reply(
          errorEmbed(true, `You do not have \`${cfg.modRole}\` permissions to use this command!`),
        );

      const message = await interaction.deferReply({ fetchReply: true });
      const isMention = options.getBoolean('mention');
      const desc = options.getString('description');
      const role = options.getRole('role');
      const members = await message.guild.roles.cache.get(role.id).members.map((m) => m.user);
      const userName = await message.guild.roles.cache
        .get(role.id)
        .members.map((m) => m.user.displayName || m.user.username);
      const isInline = options.getBoolean('inline');
      let stInline = isInline === true ? ' | ' : '\n';

      if (members) {
        const msg = desc || `Danh sách thành viên của ${role}:`;
        const embed = new EmbedBuilder().setColor('Aqua');

        if (isMention === true)
          embed
            .setDescription(`**${msg}**\n\n` + members.join(stInline))
            .setFooter({ text: `Tổng số: [${members.length}]` });
        else
          embed
            .setDescription(`**${msg}**\n\n` + userName.join(stInline))
            .setFooter({ text: `Tổng số: [${members.length}]` });

        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.editReply(errorEmbed(true, 'Can not find members or role is incorrect!'));
      }
    } catch (e) {
      console.error(chalk.red('Error (/list members):', e));
      return interaction.reply(errorEmbed(true, 'Errro when list members:', e));
    }
  },
};
