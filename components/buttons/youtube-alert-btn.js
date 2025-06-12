const { Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  data: { name: 'youtube-alert-btn' },
  /**
   * Youtube Alert Role Button
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, user, channel, message } = interaction;
    const { errorEmbed } = client;

    await interaction.reply({
      content: 'Vui lòng nhập Alert Role `@tên_role` hoặc nhập `delete` để xóa YouTube Alert Role hiện tại.',
      flags: 64,
    });

    const filter = (m) => m.author.id === user.id;
    const collector = channel.createMessageCollector({ filter, max: 1, time: 10 * 1000 });

    collector.on('collect', async (m) => {
      const input = m.content.trim().toLowerCase();
      if (m && m.deletable) await m.delete();
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
      if (!profile) return;
      const { youtube } = profile;

      const originalEmbed = message.embeds[0];
      const newEmbed = EmbedBuilder.from(originalEmbed);

      if (input === 'delete') {
        newEmbed.setDescription('Chưa có YouTube Alert Role nào được thiết lập.');
        await message.edit({ embeds: [newEmbed] });
        await interaction.followUp(
          errorEmbed({ description: `YouTube Alert Role <@${youtube.alert}> đã được xóa`, emoji: false }),
        );
        youtube.alert = null;
        await profile.save().catch(console.error);
      } else {
        const roleId = input.replace(/<@&(\d+)>/, '$1'); // Extract role ID from mention
        const role = guild.roles.cache.get(roleId);

        if (role) {
          youtube.alert = role.id;
          await profile.save().catch(console.error);
          newEmbed.setDescription(`Alert Role: ${role}`);
          await message.edit({ embeds: [newEmbed] });
        } else
          await interaction.followUp(
            errorEmbed({ description: 'Alert Role không hợp lệ hoặc role không tồn tại.', flags: 64 }),
          );
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        interaction.followUp(errorEmbed({ description: 'Hết thời gian chờ!', emoji: false }));
      }
    });
  },
};
