const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName('youtube-notify')
    .setDescription('Thiết lập kênh Discord để nhận thông báo video YouTube mới')
    .addChannelOption((opt) =>
      opt.setName('notification_channel').setDescription('Kênh Discord để gửi thông báo video mới').setRequired(true),
    ),
  category: 'sub command',
  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, guildId } = interaction;
    const notifyChannel = options.getChannel('notification_channel');
    if (!notifyChannel) {
      return interaction.reply(errorEmbed(true, 'Thiếu thông tin kênh thông báo.'));
    }
    try {
      let profile = await serverProfile.findOne({ guildID: guildId });
      if (!profile) {
        profile = await serverProfile.create({
          guildID: guildId,
          youtubeNotifyChannel: notifyChannel.id,
        });
      } else {
        profile.youtubeNotifyChannel = notifyChannel.id;
        await profile.save();
      }
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(5763719)
            .setDescription(`Đã thiết lập kênh thông báo video YouTube: <#${notifyChannel.id}>`),
        ],
        ephemeral: true,
      });
    } catch (e) {
      console.error('Lỗi setup youtube notify:', e);
      await interaction.reply({
        embeds: [errorEmbed(true, 'Có lỗi xảy ra khi thiết lập kênh thông báo.', e)],
        ephemeral: true,
      });
    }
  },
};
