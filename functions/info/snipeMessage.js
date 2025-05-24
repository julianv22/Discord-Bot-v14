const { Client, GuildMember, Message, Interaction, EmbedBuilder } = require('discord.js');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Snipe deleted message
   * @param {GuildMember} user - User object
   * @param {GuildMember} target - Target object
   * @param {Interaction} interaction - Interaction object
   * @param {Message} message - Message object
   */
  client.snipeMessage = async (user, target, interaction, message) => {
    try {
      const msg = interaction ? interaction : message;
      const { guildId, channelId } = msg;
      const snipe = await client.snipes.get(target ? guildId + '' + target.id : channelId);

      if (!snipe)
        return msg
          .reply({
            embeds: [
              {
                color: 16711680,
                description: `\❌ | There is nothing to snipe.`,
              },
            ],
            flags: 64,
          })
          .then((m) => {
            if (msg == message)
              setTimeout(() => {
                m.delete();
              }, 5000);
          });

      const { author, channelId: snpChannel, content } = snipe;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: target
            ? `${user.displayName || user.username} snipped message of ${
                target.displayName || (target.user && target.user.displayName) || 'Unknown'
              }`
            : 'Last deleted message:',
          iconURL: 'https://media.discordapp.net/attachments/976364997066231828/1012217326424293416/snipe.png',
        })
        .setColor('DarkVividPink')
        .setTimestamp()
        .setThumbnail(author.displayAvatarURL(true))
        .setFooter({
          text: `Requested by ${user.displayName || user.username}`,
          iconURL: user.displayAvatarURL(true),
        })
        .addFields([{ name: 'Author:', value: `${author}`, inline: true }])
        .addFields({
          name: target ? `Channel:` : '\u200b',
          value: target ? `<#${snpChannel}>` : '\u200b',
          inline: true,
        })
        .addFields([{ name: 'Content:', value: `${content}` }]);

      msg.reply({ embeds: [embed] });
    } catch (e) {
      if (interaction && typeof interaction.reply === 'function') {
        interaction
          .reply({
            embeds: [{ color: 16711680, title: '❌ Error', description: `${e}` }],
            flags: 64,
          })
          .catch(() => {});
      } else if (message && typeof message.reply === 'function') {
        message
          .reply({
            embeds: [{ color: 16711680, title: '❌ Error', description: `${e}` }],
          })
          .catch(() => {});
      }
      console.error(chalk.red('Error while running snipeMessage'), e);
    }
  };
};
