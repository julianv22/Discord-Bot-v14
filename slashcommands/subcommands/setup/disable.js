const {
  SlashCommandSubcommandBuilder,
  Client,
  Interaction,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('disable'),
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,

  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const menu = new StringSelectMenuBuilder().setCustomId('disable-mn').setMinValues(1).setMaxValues(1).addOptions(
      { label: '⭐ Disable Starboard System', value: 'starboard', description: 'Tắt chức năng Starboard System' },
      { label: '💡 Disable Suggest Channel', value: 'suggest', description: 'Tắt chức năng Suggestion' },
      { label: '🎬 Disable Youtube Notify', value: 'youtube', description: 'Tắt thông báo video mới trên Youtube' },
      {
        label: '🎉 Disable Welcome System',
        value: 'welcome',
        description: 'Tắt chức năng chào mừng thành viên mới',
      },
    );

    await interaction.reply({
      embeds: [
        {
          color: 15844367,
          description: '**\\⚠️ Select feature to disabe \\⚠️**',
        },
      ],
      components: [new ActionRowBuilder().addComponents(menu)],
      ephemeral: true,
    });
  },
};
