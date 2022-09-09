const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Snipe the message has been deleted')
    .addUserOption(opt => opt.setName('user').setDescription('Provide user you wanna snipe')),
  category: 'misc',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { snipes } = client;
    const { options, channel, user } = interaction;
    const target = options.getUser('user');
    const snipe = await snipes.get(target ? target.id : channel.id);

    if (!snipe)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | There is nothing to snipe!` }],
        ephemeral: true,
      });

    const { author, channel: snpChannel, content } = snipe;
    const embed = new EmbedBuilder()
      .setAuthor({
        name: target ? `${user.username} snipped message of ${target.username}` : 'Last deleted message:',
        iconURL: 'https://media.discordapp.net/attachments/976364997066231828/1012217326424293416/snipe.png',
      })
      .setColor('DarkVividPink')
      .setTimestamp()
      .setThumbnail(author.displayAvatarURL(true))
      .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL(true) })
      .addFields([{ name: 'Author:', value: `${author}`, inline: true }])
      .addFields({ name: target ? `Channel:` : '\u200b', value: target ? `${snpChannel}` : '\u200b', inline: true })
      .addFields([{ name: 'Content:', value: `${content}` }]);

    interaction.reply({ embeds: [embed] });
  },
};
