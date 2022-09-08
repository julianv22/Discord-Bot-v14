const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('help2').setDescription('Prefix Commands List'),
  category: 'help',
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const { slashcmds } = client;

    const cmdCategories = slashcmds.map(cmd => cmd.category);
    const filter = cmdCategories.filter((item, index) => cmdCategories.indexOf(item) === index);

    let count = 0;
    let cmds = [];

    filter.forEach(category => {
      let cmd = slashcmds.map(cmd => cmd).filter(cmd => cmd.category === category);
      count += cmd.length;

      cmds.push({
        name: `📂 ${category.toUpperCase()} [${cmd.length}]`,
        value: `\`\`\`fix\n${cmd.map(cmd => cmd.data.name).join(' | ')}\`\`\``,
      });
    });

    const buttons = new ActionRowBuilder().addComponents([
      new ButtonBuilder().setCustomId('yt-link-btn').setLabel('YouTube').setStyle('Danger'),
      new ButtonBuilder().setCustomId('djs-support-btn').setLabel(cfg.supportServer).setStyle('Primary'),
      new ButtonBuilder().setLabel('Invite Me!').setURL(cfg.inviteLink).setStyle('Link'),
      new ButtonBuilder().setLabel('Vote!').setURL('https://m.youtube.com/channel/UCzpvNZ7XfjwWC91kpmpM9uA').setStyle('Link'),
    ]);

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('Slash Commands (/) List')
      .setDescription(`If you need some help, join my support server: [\`${cfg.supportServer}\`](${cfg.supportLink})`)
      .setColor('Random')
      .setThumbnail(cfg.slashPNG)
      .addFields({ name: `Total commands: [${count}]`, value: '\u200b' })
      .addFields(...cmds)
      .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL(true) })
      .setTimestamp();

    interaction.reply({ embeds: [embed], components: [buttons] });
  },
};
