const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Prefix Commands List'),
  category: 'help',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user, member } = interaction;
    const { prefixCommands } = client;
    const isAdmin = member.permissions.has('Administrator');
    let cmds = [];
    const Categories = prefixCommands.map(cmd => cmd.category);
    const filters = Categories.filter((item, index) => Categories.indexOf(item) === index);

    let count = 0;
    filters.forEach(category => {
      var cmd;
      if (!isAdmin) cmd = prefixCommands.map(cmd => cmd).filter(cmd => cmd.category === category && !cmd.description.includes(cfg.adminRole));
      else cmd = prefixCommands.map(cmd => cmd).filter(cmd => cmd.category === category);

      count += cmd.length;

      cmds.push({
        name: `📂 ${category.toUpperCase()} [${cmd.length}]`,
        value: `\`\`\`fix\n${cmd.map(cmd => cmd.name).join(' | ')}\`\`\``,
      });
    });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('yt-link-btn').setLabel('YouTube').setStyle('Danger'),
      new ButtonBuilder().setCustomId('djs-support-btn').setLabel(cfg.supportServer).setStyle('Primary'),
      new ButtonBuilder().setLabel('Invite Me!').setURL(cfg.inviteLink).setStyle('Link'),
      new ButtonBuilder().setLabel('Vote!').setURL('https://top.gg/servers/954736697453731850/vote').setStyle('Link')
    );

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`Prefix Commands (${prefix}) List`)
      .setDescription(`If you need some help, join my support server: [\`${cfg.supportServer}\`](${cfg.supportLink})`)
      .setColor('Random')
      .setThumbnail(cfg.helpPNG)
      .addFields([{ name: `Total commands: [${count}]`, value: `Command prefix: \`${prefix}\`` }])
      .addFields(...cmds)
      .addFields([{ name: `\u200b`, value: `\`${prefix}<command> ?\` to show more details` }])
      .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL() })
      .setTimestamp();

    interaction.reply({ embeds: [embed], components: [buttons] });
  },
};
