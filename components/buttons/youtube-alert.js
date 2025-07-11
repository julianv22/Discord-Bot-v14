const { Client, ButtonInteraction, EmbedBuilder } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'buttons',
  data: { name: 'youtube-alert' },
  /** - Youtube Alert Role Button
   * @param {ButtonInteraction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, channel, message } = interaction;
    const { errorEmbed } = client;
    const { id: guildID } = guild;
    const newEmbed = EmbedBuilder.from(message.embeds[0]);
    let desc = newEmbed.data.description;

    await interaction.update({
      embeds: [
        newEmbed.setDescription(
          desc + '\n\nVui lòng nhập Alert Role `@tên_role` hoặc nhập `delete` để xóa YouTube Alert Role hiện tại.'
        ),
      ],
      flags: 64,
    });

    const filter = (m) => m.author.id === user.id;
    const collector = channel.createMessageCollector({ filter, max: 1, time: 10 * 1000 });

    collector.on('collect', async (m) => {
      const input = m.content.trim();
      if (m && m.deletable) await m.delete().catch(console.error);

      const profile = await serverProfile.findOne({ guildID }).catch(console.error);
      if (!profile)
        return await interaction.followUp(errorEmbed({ desc: 'Không tìm thấy dữ liệu máy chủ trong cơ sở dữ liệu!' }));

      const { youtube } = profile;

      if (input.toLowerCase() === 'delete') {
        if (youtube.alert) {
          await interaction.followUp(errorEmbed({ desc: `YouTube Alert Role <@&${youtube.alert}> đã được xóa` }));

          youtube.alert = null;
          await profile.save().catch(console.error);

          desc = 'Chưa có YouTube Alert Role nào được thiết lập.';
        } else await interaction.followUp(errorEmbed({ desc: 'Không có YouTube Alert Role nào để xóa.' }));
      } else {
        const roleIdMatch = input.match(/^<@&(\d+)>$/);

        let role = null;
        if (roleIdMatch) role = guild.roles.cache.get(roleIdMatch[1]);
        else role = guild.roles.cache.find((r) => r.name.toLowerCase() === input.toLowerCase());

        if (role) {
          youtube.alert = role.id;
          await profile.save().catch(console.error);

          desc = `Alert Role: ${role}`;
        } else {
          desc = 'Alert Role không hợp lệ hoặc role không tồn tại.';
          await interaction.followUp(errorEmbed({ desc: 'Alert Role không hợp lệ hoặc role không tồn tại.' }));
        }
      }

      await interaction.editReply({ embeds: [newEmbed.setDescription(desc)] });
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') interaction.followUp(errorEmbed({ desc: 'Hết thời gian chờ!' }));
    });
  },
};
