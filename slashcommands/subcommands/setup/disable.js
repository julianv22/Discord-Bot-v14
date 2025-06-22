const {
  SlashCommandSubcommandBuilder,
  ActionRowBuilder,
  Client,
  ChatInputCommandInteraction,
  ButtonStyle,
  ComponentType,
  Colors,
} = require('discord.js');
const { rowComponents } = require('../../../functions/common/components');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('disable'),
  /** - Disable features
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
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

    await interaction.reply({
      embeds: [
        {
          author: { name: 'Disable Features', iconURL: user.displayAvatarURL(true) },
          color: Colors.Orange,
          fields: [
            { name: '\\⭐ Disable Starboard System', value: '`Tắt chức năng Starboard System`' },
            { name: '\\💡 Disable Suggest Channel', value: '`Tắt chức năng Suggestion`' },
            { name: '\\🎬 Disable Youtube Notify', value: '`Tắt thông báo video mới trên Youtube`' },
            { name: '\\🎉 Disable Welcome System', value: '`Tắt chức năng chào mừng thành viên mới`' },
          ],
          thumbnail: { url: guild.iconURL(true) },
          timestamp: new Date(),
          footer: { text: guild.name, iconURL: guild.iconURL(true) },
        },
      ],
      components: [
        new ActionRowBuilder().addComponents(rowComponents(buttons1, ComponentType.Button)),
        new ActionRowBuilder().addComponents(rowComponents(buttons2, ComponentType.Button)),
      ],
      flags: 64,
    });
  },
};
