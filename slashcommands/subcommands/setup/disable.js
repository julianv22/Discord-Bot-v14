const {
  SlashCommandSubcommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  Client,
  Interaction,
} = require('discord.js');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('disable'),
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  /**
   * Disable a feature
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const features = [
      {
        emoji: { name: `⭐` },
        label: 'Disable Starboard System',
        value: 'starboard',
        description: 'Tắt chức năng Starboard System',
      },
      {
        emoji: { name: `💡` },
        label: 'Disable Suggest Channel',
        value: 'suggest',
        description: 'Tắt chức năng Suggestion',
      },
      {
        emoji: { name: `🎬` },
        label: 'Disable Youtube Notify',
        value: 'youtube',
        description: 'Tắt thông báo video mới trên Youtube',
      },
      {
        emoji: { name: `🎉` },
        label: 'Disable Welcome System',
        value: 'welcome',
        description: 'Tắt chức năng chào mừng thành viên mới',
      },
    ];

    await interaction.reply({
      embeds: [
        {
          color: 15844367,
          description: '**\\⚠️ Select feature to disabe \\⚠️**',
        },
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('disable-mn')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(
              features.map((f) => ({
                emoji: f.emoji,
                label: f.label,
                value: f.value,
                description: f.description,
              })),
            ),
        ),
      ],
      ephemeral: true,
    });
  },
};
