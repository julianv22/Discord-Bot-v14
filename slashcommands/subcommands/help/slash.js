const { SlashCommandSubcommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('slash').setDescription('Slash Commands (/) List'),
  category: 'sub command',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user, member } = interaction;
    const { slashCommands, subCommands, listCommands } = client;

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
      .addFields({ name: `Total commands: [${listCommands(slashCommands, member).count}]`, value: `Sub commands: [${subCommands.size}]` })
      .addFields(listCommands(slashCommands, member).commands)
      .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL(true) })
      .setTimestamp();

    interaction.reply({ embeds: [embed], components: [buttons] });
  },
};
