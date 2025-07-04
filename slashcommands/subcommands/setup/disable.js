const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
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
  /** - Disables various features on the server.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const buttons1 = [
        {
          label: '⭐ Disable Starboard System',
          customId: 'disable-btn:starboard',
          style: ButtonStyle.Primary,
          // Disables the Starboard System feature.
        },
        {
          label: '💡 Disable Suggest Channel',
          customId: 'disable-btn:suggest',
          style: ButtonStyle.Primary,
          // Disables the Suggestion feature.
        },
      ],
      buttons2 = [
        {
          label: '🎬 Disable Youtube Notify',
          customId: 'disable-btn:youtube',
          style: ButtonStyle.Danger,
          // Disables new YouTube video notifications.
        },
        {
          label: '🎉 Disable Welcome System',
          customId: 'disable-btn:welcome',
          style: ButtonStyle.Success,
          // Disables the new member welcome feature.
        },
      ];

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Disable Features', iconURL: user.displayAvatarURL(true) })
      .setColor(Colors.Orange)
      .setThumbnail(guild.iconURL(true))
      .setTimestamp()
      .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
      .addFields(
        { name: '\\⭐ Disable Starboard System', value: '`Disables the Starboard System feature.`' },
        { name: '\\💡 Disable Suggest Channel', value: '`Disables the Suggestion feature.`' },
        { name: '\\🎬 Disable Youtube Notify', value: '`Disables new YouTube video notifications.`' },
        { name: '\\🎉 Disable Welcome System', value: '`Disables the new member welcome feature.`' }
      );

    await interaction.reply({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(rowComponents(buttons1, ComponentType.Button)),
        new ActionRowBuilder().addComponents(rowComponents(buttons2, ComponentType.Button)),
      ],
      flags: 64,
    });
  },
};
