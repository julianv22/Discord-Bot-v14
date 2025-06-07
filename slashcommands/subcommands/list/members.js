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
    const { errorEmbed } = client;
    const { options } = interaction;
    const isMod = interaction.member.permissions.has(PermissionFlagsBits.ManageMessages);

    try {
      if (!isMod)
        return await interaction.reply(
          errorEmbed({
            description: `You do not have \`${cfg.modRole}\` permissions to use this command!`,
            emoji: false,
          }),
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

        return await interaction.editReply({ embeds: [embed] });
      } else {
        return await interaction.editReply(
          errorEmbed({ description: 'Can not find members or role is incorrect!', emoji: false }),
        );
      }
    } catch (e) {
      console.error(chalk.red('Error while executing /list members command', e));
      return await interaction.reply(
        errorEmbed({ title: `\\❌ Error while executing /list members command`, description: e, color: Colors.Red }),
      );
    }
  },
};
