const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('status').setDescription('Starboard System Status'),
  category: 'starboard',
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, guildId } = interaction;
    let profile = await serverProfile.findOne({ guildID: guildId });

    if (!profile || profile.starCount === 0) {
      return interaction.reply(
        errorEmbed(true, 'Starboard System chưa được setup. Sử dụng `/setup starboard` để cài đặt'),
      );
    } else {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Random')
            .setTitle('Starboard System info')
            .setDescription(
              `Channel: <#${profile.starboardChannel ?? 'Not set'}>\nStar requirement: ${
                profile.starCount ?? 'undefine'
              }\\⭐`,
            )
            .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
            .setTimestamp()
            .setFooter({ text: `Requested by ${user.displayName}`, iconURL: user.displayAvatarURL(true) }),
        ],
        ephemeral: true,
      });
    }
  },
};
