const { SlashCommandSubcommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('prefix').setDescription(`Prefix Commands (${prefix}) List`),
  category: 'sub command',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user, member } = interaction;
    const { prefixCommands, listCommands } = client;

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
      .addFields([{ name: `Total commands: [${listCommands(prefixCommands, member).count}]`, value: `Command prefix: \`${prefix}\`` }])
      .addFields(listCommands(prefixCommands, member).commands)
      .addFields([{ name: `\u200b`, value: `\`${prefix}<command> ?\` to show more details` }])
      .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL() })
      .setTimestamp();

    interaction.reply({ embeds: [embed], components: [buttons] });
  },
};
