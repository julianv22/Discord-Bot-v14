const {
  SlashCommandSubcommandBuilder,
  ActionRowBuilder,
  Client,
  Interaction,
  ButtonStyle,
  EmbedBuilder,
  ComponentType,
  Colors,
} = require('discord.js');
const { setRowComponent } = require('../../../functions/common/components');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('disable'),
  /**
   * Disable a feature
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const buttons1 = [
      {
        label: '⭐ Disable Starboard System',
        customId: 'disable-btn:starboard',
        style: ButtonStyle.Primary,
        // 'Tắt chức năng Starboard System',
      },
      {
        label: '💡 Disable Suggest Channel',
        customId: 'disable-btn:suggest',
        style: ButtonStyle.Primary,
        // 'Tắt chức năng Suggestion',
      },
    ];
    const buttons2 = [
      {
        label: '🎬 Disable Youtube Notify',
        customId: 'disable-btn:youtube',
        style: ButtonStyle.Danger,
        // 'Tắt thông báo video mới trên Youtube',
      },
      {
        label: '🎉 Disable Welcome System',
        customId: 'disable-btn:welcome',
        style: ButtonStyle.Success,
        // 'Tắt chức năng chào mừng thành viên mới',
      },
    ];
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Disable Features`, iconURL: user.displayAvatarURL(true) })
      .setColor(Colors.Orange)
      .addFields(
        { name: '\\⭐ Disable Starboard System', value: '`Tắt chức năng Starboard System`' },
        { name: '\\💡 Disable Suggest Channel', value: '`Tắt chức năng Suggestion`' },
        { name: '\\🎬 Disable Youtube Notify', value: '`Tắt thông báo video mới trên Youtube`' },
        { name: '\\🎉 Disable Welcome System', value: '`Tắt chức năng chào mừng thành viên mới`' },
      )
      .setTimestamp()
      .setThumbnail(guild.iconURL(true))
      .setFooter({ text: guild.name, iconURL: guild.iconURL(true) });
    await interaction.reply({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(setRowComponent(buttons1, ComponentType.Button)),
        new ActionRowBuilder().addComponents(setRowComponent(buttons2, ComponentType.Button)),
      ],
      flags: 64,
    });
  },
};
