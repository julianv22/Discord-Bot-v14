const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName('starboard')
    .setDescription(`Setup starboard system. ${cfg.adminRole} only`),
  category: 'starboard',
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user, options, guild, guildId } = interaction;
    const channel = options.getChannel('starboard-channel');
    const number = options.getInteger('starnum');

    if (number < 0 || number > 20)
      return interaction.reply(errorEmbed(true, 'Số star \\⭐ không thể nhỏ hơn 0 hoặc lớn hơn 20'));

    try {
      let profile = await serverProfile.findOne({ guildID: guildId });

      if (!profile) {
        profile = await serverProfile.create({
          guildID: guildId,
          starboardChannel: channel.id,
          starCount: number,
        });
      } else {
        profile.starboardChannel = channel.id;
        profile.starCount = number;
        await profile.save();
        await interaction.reply(
          errorEmbed(false, `Các tin nhắn đạt được ${number}\\⭐ react sẽ được gửi tới channel ${channel}`),
        );
      }
    } catch (e) {
      console.error(chalk.yellow.bold('Lỗi setup starboard command', e));
      return interaction.reply(errorEmbed(true, 'Lỗi setup starboard command', e));
    }
  },
};
