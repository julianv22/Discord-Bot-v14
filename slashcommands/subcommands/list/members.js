const {
  SlashCommandSubcommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Client,
  ChatInputCommandInteraction,
  Colors,
} = require('discord.js');

module.exports = {
  category: 'sub command',
  parent: 'list',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('members'),

  /** - Get members list by role
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, options, member } = interaction;
    const { errorEmbed, catchError } = client;
    const [desc, role, isMention, inline] = [
      options.getString('description'),
      options.getRole('role'),
      options.getBoolean('mention'),
      options.getBoolean('inline'),
    ];
    const members = guild.roles.cache.get(role.id).members.map((m) => m.user);
    const userName = guild.roles.cache.get(role.id).members.map((m) => m.user.displayName || m.user.username);
    let strJoin = inline === true ? ' | ' : '\n';
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
            .setDescription(`**${msg}**\n\n` + members.join(strJoin))
            .setFooter({ text: `Tổng số: [${members.length}]` });
        else
          embed
            .setDescription(`**${msg}**\n\n` + userName.join(strJoin))
            .setFooter({ text: `Tổng số: [${members.length}]` });

        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply(errorEmbed({ desc: 'Can not find members or role is incorrect!', emoji: false }));
      }
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
