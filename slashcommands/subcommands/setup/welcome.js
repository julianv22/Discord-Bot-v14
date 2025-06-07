const { SlashCommandSubcommandBuilder, EmbedBuilder, Client, Interaction, Colors } = require('discord.js');
const serverProfile = require(`../../../config/serverProfile`);

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('welcome'),
  /**
   * Setup welcome channel with welcome message and log channel
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { user, guild, options } = interaction;
    const { cache: channels } = client.channels;
    const welcomeChannel = channels.get(options.getChannel('welcome').id);
    const logChannel = channels.get(options.getChannel('log').id);
    const welcomeMsg = options.getString('message');
    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
    if (!profile)
      serverProfile.create({ guildID: guild.id, guildName: guild.name, prefix: cfg.prefix }).catch(console.error);
    try {
      const { welcome } = profile.setup;
      welcome.channel = welcomeChannel.id;
      welcome.log = logChannel.id;
      welcome.message = welcomeMsg;
      await profile.save().catch(console.error);

      const embed = new EmbedBuilder()
        .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
        .setTitle(`Welcome's setup information`)
        .setColor(Colors.Aqua)
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

      return await interaction.reply({ embeds: [embed], flags: 64 });
    } catch (e) {
      const error = `Error while executing ${this.category} /${this.parent} ${this.data.name}\n`;
      const embed = errorEmbed({ title: `\\❌ ${error}`, description: e, color: Colors.Red });
      console.error(chalk.red(error), e);
      if (!interaction.replied && !interaction.deferred) return await interaction.reply(embed);
      else return await interaction.editReply(embed);
    }
  },
};
