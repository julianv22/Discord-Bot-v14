const { Client, GuildMember, Message, Interaction, EmbedBuilder } = require('discord.js');

/** @param {Client} client */
module.exports = client => {
  /**
   * @param {GuildMember} user
   * @param {GuildMember} target
   * @param {Interaction} interaction
   * @param {Message} message
   */
  client.snipeMessage = async (user, target, interaction, message) => {
    try {
      const msg = interaction ? interaction : message;
      const snipe = await client.snipes.get(target ? target.id : msg.channel.id);

      if (!snipe)
        return msg
          .reply({
            embeds: [{ color: 16711680, description: `\\❌ | There is nothing to snipe!` }],
            ephemeral: true,
          })
          .then(m => {
            if (msg == message)
              setTimeout(() => {
                m.delete();
              }, 5000);
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

      msg.reply({ embeds: [embed] });
    } catch (e) {
      console.error(chalk.yellow.bold('Error while running snipeMessage'), e);
    }
  };
};
