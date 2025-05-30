const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
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
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(() => {});
      if (!profile)
        await serverProfile.create({ guildID: guild.id, guildName: guild.name, prefix: cfg.prefix }).catch(() => {});

      profile.setup.starboard.channel = channel.id;
      profile.setup.starboard.star = number;
      await profile.save().catch(() => {});
      return await interaction.reply(
        errorEmbed({
          description: `Các tin nhắn đạt được ${number}\\⭐ react sẽ được gửi tới channel ${channel}`,
          emoji: true,
        }),
      );
    } catch (e) {
      console.error(chalk.red('Error (/setup starboard):', e));
      return await interaction.reply(
        errorEmbed({ title: `\\❌ | Error when setup starboard channel`, description: e, color: 'Red' }),
      );
    }
  },
};
