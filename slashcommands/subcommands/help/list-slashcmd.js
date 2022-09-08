const {
  SlashCommandBuilder: SlashCommandSubcommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  Client,
  Interaction,
} = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('slash-command').setDescription('Slash Commands (/) List'),
  category: 'sub command',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const { slashCommands, subCommands } = client;
    const isAdmin = interaction.member.permissions.has('Administrator');
    let cmds = [];
    const Categories = slashCommands.map(cmd => cmd.category);
    const filters = Categories.filter((item, index) => Categories.indexOf(item) === index);

    let count = 0;
    filters.forEach(category => {
      let cmd;
      if (!isAdmin) cmd = slashCommands.map(cmd => cmd).filter(cmd => cmd.category === category && cmd.permissions != 8);
      else cmd = slashCommands.map(cmd => cmd).filter(cmd => cmd.category === category);
      count += cmd.length;
      cmds.push({
        name: `📂 ${category.toUpperCase()} [${cmd.length}]`,
        value: `\`\`\`fix\n${cmd.map(cmd => cmd.data.name).join(' | ') || 'None'}\`\`\``,
      });
    });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('yt-link-btn').setLabel('YouTube').setStyle('Danger'),
      new ButtonBuilder().setCustomId('djs-support-btn').setLabel(cfg.supportServer).setStyle('Primary'),
      new ButtonBuilder().setLabel('Invite Me!').setURL(cfg.inviteLink).setStyle('Link'),
      new ButtonBuilder().setLabel('Vote!').setStyle('Link').setURL('https://top.gg/servers/954736697453731850/vote')
    );

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('Slash Commands (/) List')
      .setDescription(`If you need some help, join my support server: [\`${cfg.supportServer}\`](${cfg.supportLink})`)
      .setColor('Random')
      .setThumbnail(cfg.slashPNG)
      .addFields({ name: `Total commands: [${count}]`, value: `Sub commands: [${subCommands.size}]` })
      .addFields(...cmds)
      .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL(true) })
      .setTimestamp();

    interaction.reply({ embeds: [embed], components: [buttons] });
  },
};
