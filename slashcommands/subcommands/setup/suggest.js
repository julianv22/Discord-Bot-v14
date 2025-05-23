const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('suggest'),
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  /**
   * Setup suggest channel
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed, channels } = client;
    const { guild, options } = interaction;
    const channel = options.getChannel('schannel');
    const sgtChannel = await channels.cache.get(channel.id);
    try {
      if (await serverProfile.findOne({ guildID: guild.id }))
        serverProfile
          .create({ guildID: guild.id, guildName: guild.name, prefix: cfg.prefix, suggestChannel: sgtChannel })
          .catch(() => {});

      await interaction.reply(errorEmbed(false, `Channel to send suggestions has been changed to ${channel}!`));

      await serverProfile
        .findOneAndUpdate({ guildID: guild.id }, { guildName: guild.name, suggestChannel: sgtChannel })
        .catch(() => {});
    } catch (e) {
      console.error(chalk.red('Error (/setup suggest):', e));
      return await interaction.reply(errorEmbed(true, 'Error when setup suggest channel:', e));
    }
  },
};
