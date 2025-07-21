const { Client, EmbedBuilder, ContainerBuilder, MessageFlags, Colors } = require('discord.js');
const { textDisplay } = require('../common/components');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  const regex = /\x1b\[[0-9;]*m/g;
  /** - Creates an error message embed.
   * @param {object} options - The options for creating the error embed.
   * @param {string} options.title - The title of the embed.
   * @param {string} options.desc - The detailed description of the error.
   * @param {(boolean|string)} [options.emoji=false] - The emoji to prefix the title or description. If boolean, uses default success/error emojis.
   * @param {boolean} [options.flags=true] - Whether the message should be ephemeral. Defaults to `true`.
   * @param {(string|Colors)} [options.color] - The color of the embed. */
  client.errorEmbed = ({ title, desc, emoji = false, flags = true, color }) => {
    const embed = new EmbedBuilder().setColor(color || (emoji ? Colors.Green : Colors.Red));

    switch (typeof emoji) {
      case 'boolean':
        embed.setAuthor({
          name: title ? title.replace(regex, '') : desc,
          iconURL: emoji ? cfg.verified_gif : cfg.x_mark_gif,
        });

        if (title) embed.setDescription(`\`\`\`ansi\n\x1b[33m${desc}\x1b[0m\`\`\``);
        break;
      case 'string':
        if (title)
          embed
            .setTitle(`\\${emoji} ${title.replace(regex, '')}`)
            .setDescription(`\`\`\`ansi\n\x1b[33m${desc}\x1b[0m\`\`\``);
        else embed.setDescription(`\\${emoji} ${desc}`);
        break;
      default:
        return flags && { flags: MessageFlags.Ephemeral };
    }

    return { embeds: [embed], ...(flags && { flags: MessageFlags.Ephemeral }) };
  };

  /** - Creates an error message container.
   * @param {string} description - The detailed description of the error.
   * @param {(boolean|string)} [emoji=false] - The emoji to prefix the description. If boolean, uses default success/error emojis.
   * @param {(number)} [color] - The accent color of the container.
   * @param {boolean} [flags=true] - Whether the message should be ephemeral. Defaults to `true`. */
  client.errorContainer = (description, emoji = false, color, flags = true) => {
    const container = new ContainerBuilder().setAccentColor(color || (emoji ? Colors.Green : Colors.Red));

    let prefix = '\\';

    if (typeof emoji === 'boolean') prefix += emoji ? '✅' : '❌';
    else prefix += emoji;
    prefix += ' ';

    container.addTextDisplayComponents(textDisplay(prefix + description));

    return {
      flags: [MessageFlags.IsComponentsV2, flags && MessageFlags.Ephemeral],
      components: [container],
    };
  };
};
