const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');
module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('suggest'),
  /**
   * Setup suggest channel
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed, channels } = client;
    const { guild, options } = interaction;
    const channel = options.getChannel('schannel');
    const sgtChannel = channels.cache.get(channel.id);
    try {
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
      if (!profile)
        await serverProfile
          .create({ guildID: guild.id, guildName: guild.name, prefix: cfg.prefix, setup: { suggest: sgtChannel } })
          .catch(console.error);

      await serverProfile
        .findOneAndUpdate({ guildID: guild.id }, { guildName: guild.name, setup: { suggest: sgtChannel } })
        .catch(console.error);

      return await interaction.reply(
        errorEmbed({
          description: `Channel to send suggestions has been changed to ${channel}!`,
          emoji: true,
        }),
      );
    } catch (e) {
      console.error(chalk.red('Error while executing /setup suggest command', e));
      return await interaction.reply(
        errorEmbed({ title: `\\❌ Error while setting up suggest channel`, description: e, color: 'Red' }),
      );
    }
  },
};
