const { SlashCommandSubcommandBuilder, Client, Interaction, Colors } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('starboard'),
  /**
   * Setup starboard
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, guild } = interaction;
    const channel = options.getChannel('starboard-channel');
    const number = options.getInteger('starnum');

    try {
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
      if (!profile)
        await serverProfile
          .create({ guildID: guild.id, guildName: guild.name, prefix: cfg.prefix })
          .catch(console.error);
      const { starboard } = profile.setup;
      starboard.channel = channel.id;
      starboard.star = number;
      await profile.save().catch(console.error);
      return await interaction.reply(
        errorEmbed({
          description: `Các tin nhắn đạt được ${number}\\⭐ react sẽ được gửi tới channel ${channel}`,
          emoji: true,
        }),
      );
    } catch (e) {
      console.error(chalk.red('Error while executing /setup starboard command', e));
      return await interaction.reply(
        errorEmbed({ title: `\\❌ Error while setting up starboard channel`, description: e, color: Colors.Red }),
      );
    }
  },
};
