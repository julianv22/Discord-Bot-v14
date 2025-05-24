const serverProfile = require(`../../../config/serverProfile`);
const { SlashCommandSubcommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('welcome'),
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  /**
   * Setup welcome channel with welcome message and log channel
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { user, guild, options } = interaction;
    const { cache: channels } = client.channels;
    const welcomeChannel = await channels.get(options.getChannel('welcome').id);
    const logChannel = await channels.get(options.getChannel('log').id);
    const welcomeMsg = options.getString('message');
    try {
      await serverProfile
        .findOneAndUpdate(
          { guildID: guild.id },
          {
            guildName: guild.name,
            welcomeChannel: options.getChannel('welcome').id,
            logChannel: options.getChannel('log').id,
            welcomeMessage: welcomeMsg,
          },
        )
        .catch(() => {});

      const embed = new EmbedBuilder()
        .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
        .setTitle(`Welcome's setup information`)
        .setColor('Aqua')
        .setTimestamp()
        .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
        .addFields([
          {
            name: 'Welcome channel:',
            value: welcomeChannel.toString(),
            inline: true,
          },
          { name: 'Log channel:', value: logChannel.toString(), inline: true },
          { name: 'Welcome message:', value: welcomeMsg || 'None' },
        ]);

      await interaction.reply({ embeds: [embed], flags: 64 });
    } catch (e) {
      console.error(chalk.red('Error (/setup welcome):', e));
      return await interaction.reply(errorEmbed(true, 'Error setup welcome'), e);
    }
  },
};
