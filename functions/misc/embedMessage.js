const { Client, EmbedBuilder, ContainerBuilder, MessageFlags, Colors } = require('discord.js');
const { textDisplay } = require('../common/components');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  const regex = /\x1b\[[0-9;]*m/g;
  /** - The options for creating the error embed.
   * @typedef {object} EmbedData
   * @property {string} [title] - The title of the embed.
   * @property {string} desc - The detailed description of the error.
   * @property {boolean|string} [emoji = false] - The emoji to prefix the title or description. If boolean, uses default success/error emojis.
   * @property {boolean} [flags = true] - Whether the message should be ephemeral. Defaults to `true`.
   * @property {string|number} [color] - The color of the embed.
   * @property {boolean} [isError = false] - */

  /** - Creates an error message embed.
   * @param {EmbedData} options - The options for creating the error embed. */
  client.embedMessage = (options) => {
    const { title, color, flags = true } = options;
    let { desc, emoji = false } = options;

    title?.replace(regex, '');
    const embed = new EmbedBuilder().setColor(color || (emoji ? Colors.Green : Colors.Red));

    switch (typeof emoji) {
      case 'boolean':
        embed.setAuthor({ name: title || desc, iconURL: emoji ? cfg.verified_gif : cfg.x_mark_gif });
        if (title) embed.setDescription(desc);

        break;
      case 'string':
        if (emoji.checkURL()) {
          embed.setAuthor({ name: title || desc, iconURL: emoji });
          if (title) embed.setDescription(desc);
        } else {
          emoji = `\\${emoji} `;
          embed.setDescription((title ? '' : emoji) + desc);
          if (title) embed.setTitle(emoji + title);
        }

        break;
      default:
        break;
    }

    return { embeds: [embed], ...(flags && { flags: MessageFlags.Ephemeral }) };
  };
};
