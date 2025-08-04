const { Client, Interaction, Message, EmbedBuilder, ChannelType, Colors } = require('discord.js');
const { logError, embedMessage } = require('../common/logging');
const chalk = require('chalk');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  const regex = /\x1b\[[0-9;]*m/g;
  /** - Displays an error when caught.
   * @param {Interaction|Message} object - The interaction or message object.
   * @param {Error} e - The error object.
   * @param {string|Interaction} description - A description of the error, or the interaction object that caused the error. */
  client.catchError = async (object, e, description) => {
    const { guilds } = client;
    const user = object?.user || object?.author;

    const errorMessage = () => {
      if (typeof description === 'string') return description;

      if (typeof description === 'object')
        return `Error while executing ${chalk.green(
          `/${description.parent ? description.parent + ' ' : ''}${description.data.name}`
        )} command`;

      return 'Unknown error';
    };

    console.error(chalk.red(errorMessage() + '\n'), e);

    try {
      const guild = guilds.cache.get(cfg.bugGuildId);
      const channel = guild.channels.cache.get(cfg.bugChannelId);

      if (!guild)
        return logError({
          isWarn: true,
          todo: 'Can not find',
          item: 'guild',
          desc: `with ID: ${chalk.yellow(cfg.bugGuildId)}`,
        });

      if (!channel || channel.type !== ChannelType.GuildText)
        return logging({
          isWarn: true,
          todo: 'Can not find',
          item: 'channel',
          desc: `with ID: ${chalk.yellow(cfg.bugChannelId)}`,
        });

      const bugEmbed = new EmbedBuilder()
        .setColor(Colors.DarkVividPink)
        .setAuthor({ name: errorMessage().replace(regex, ''), iconURL: cfg.x_mark_gif })
        .setDescription(
          `**Used:** ${user.displayName || user.username} [ \`${user.id}\` ]\n\n**Server: [${
            object.guild.name
          }](https://discord.com/channels/${object.guild.id}) \n\nChannel: [# ${
            object.channel.name
          }](https://discord.com/channels/${object.guild.id}/${object.channel.id})**`
        )
        .setFooter({ text: object.guild.name + ' Error Reports', iconURL: object.guild.iconURL(true) })
        .setTimestamp();

      if (e.stack)
        bugEmbed.addFields({
          name: 'Stack:',
          value: '```ansi\n\x1b[33m' + (e.stack || 'undefined').slice(0, 1000) + '\x1b[0m```',
        });
      else bugEmbed.addFields({ name: 'Error Message:', value: `\`${e.message.slice(0, 1000)}\`` });

      if (e.cause)
        bugEmbed.addFields({
          name: 'Cause:',
          value: '```ansi\n\x1b[36m' + (e.cause || 'undefined').slice(0, 1000) + '\x1b[0m```',
        });

      await channel.send({ embeds: [bugEmbed] }).then(async () => {
        const embed = embedMessage({
          title: errorMessage(),
          desc: `\`\`\`ansi\n\x1b[33m${String(e).slice(0, 4000)}\x1b[0m\`\`\``,
        });

        if (object) {
          if (object?.author)
            return await object
              .reply(embed)
              .then((m) => setTimeout(async () => await m.delete().catch(console.error), 10 * 1000));

          if (!object.replied && !object.deferred) return await object.reply(embed);

          await object.editReply(embed);
        }
      });
    } catch (e) {
      return logError({ todo: 'sending', item: 'the report', desc: 'to the error channel log' }, e);
    }
  };
};
