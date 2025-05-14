const serverProfile = require(`../../../config/serverProfile`);
const { SlashCommandSubcommandBuilder, Client, EmbedBuilder, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('welcome-channel').setDescription(`setup`),
  category: 'sub command',

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { user, guild, options } = interaction;
    const { cache: channels } = client.channels;
    const welcomeChannel = await channels.get(options.getChannel('welcome').id);
    const logChannel = await channels.get(options.getChannel('log').id);

    let info = [];
    const embed = new EmbedBuilder()
      .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL(true) })
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
      ]);
    interaction.reply({ embeds: [embed], ephemeral: true });

    await serverProfile.findOneAndUpdate(
      { guildID: guild.id },
      {
        guildName: guild.name,
        welcomeChannel: options.getChannel('welcome').id,
        logChannel: options.getChannel('log').id,
      },
    );
  },
};
