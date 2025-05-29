const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('starboard'),
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  /**
   * Setup starboard
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, guild, guildId } = interaction;
    const channel = options.getChannel('starboard-channel');
    const number = options.getInteger('starnum');

    try {
      let profile = await serverProfile.findOne({ guildID: guildId }).catch(() => {});
      if (!profile)
        await serverProfile.create({ guildID: guildId, guildName: guild.name, prefix: cfg.prefix }).catch(() => {});

      profile.setup.starboard.channel = channel.id;
      profile.setup.starboard.star = number;
      await profile.save().catch(() => {});
      return await interaction.reply(
        errorEmbed(false, `Các tin nhắn đạt được ${number}\\⭐ react sẽ được gửi tới channel ${channel}`),
      );
    } catch (e) {
      console.error(chalk.red('Error (/setup starboard):', e));
      return await interaction.reply(errorEmbed(true, 'Error when setup starboard channel:', e));
    }
  },
};
