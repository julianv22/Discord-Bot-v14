const { ContextMenuCommandBuilder, EmbedBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder().setName(`Snipe Message`).setType(ApplicationCommandType.User),
  category: 'context menu',
  scooldown: 0,
  
  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { user, targetUser: target } = interaction;
    const snipe = await client.snipes.get(target.id); //.map(s => s).filter(s => s.author.id === target.id);

    if (!snipe)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | There are nothing to snipe!` }],
        ephemeral: true,
      });

    const { author, channel, content } = snipe;
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${user.username} snipped message of ${target.username}`,
        iconURL: 'https://media.discordapp.net/attachments/976364997066231828/1012217326424293416/snipe.png',
      })
      .setColor('DarkVividPink')
      .setTimestamp()
      .setThumbnail(author.displayAvatarURL(true))
      .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL(true) })
      .addFields([
        { name: 'Author:', value: `${author}`, inline: true },
        { name: `Channel:`, value: `${channel}`, inline: true },
        { name: 'Content:', value: `${content}` },
      ]);

    interaction.reply({ embeds: [embed] });
  },
};
