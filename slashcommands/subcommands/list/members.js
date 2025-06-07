const {
  SlashCommandSubcommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Client,
  Interaction,
  Colors,
} = require('discord.js');

module.exports = {
  category: 'sub command',
  parent: 'list',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('members'),

  /**
   * Get members of a role
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, options, member } = interaction;
    const { errorEmbed, catchError } = client;
    const isMention = options.getBoolean('mention');
    const desc = options.getString('description');
    const role = options.getRole('role');
    const members = guild.roles.cache.get(role.id).members.map((m) => m.user);
    const userName = guild.roles.cache.get(role.id).members.map((m) => m.user.displayName || m.user.username);
    const isInline = options.getBoolean('inline');
    let stInline = isInline === true ? ' | ' : '\n';
    const isMod = member.permissions.has(PermissionFlagsBits.ManageMessages);

    if (!isMod)
      return await interaction.editReply(
        errorEmbed({
          description: `You do not have \`${cfg.modRole}\` permissions to use this command!`,
          emoji: false,
        }),
      );

    try {
      if (members) {
        const msg = desc || `Danh sách thành viên của ${role}:`;
        const embed = new EmbedBuilder().setColor(Colors.Aqua);

        if (isMention === true)
          embed
            .setDescription(`**${msg}**\n\n` + members.join(stInline))
            .setFooter({ text: `Tổng số: [${members.length}]` });
        else
          embed
            .setDescription(`**${msg}**\n\n` + userName.join(stInline))
            .setFooter({ text: `Tổng số: [${members.length}]` });

        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply(
          errorEmbed({ description: 'Can not find members or role is incorrect!', emoji: false }),
        );
      }
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
