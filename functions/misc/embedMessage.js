const { Client, EmbedBuilder, MessageFlags, Colors } = require('discord.js');

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
    const author = title?.replace(regex, '') || desc;

    const embed = new EmbedBuilder().setColor(color || (emoji ? Colors.Green : Colors.Red));

    switch (typeof emoji) {
      case 'boolean':
        embed
          .setAuthor({ name: author, iconURL: emoji ? cfg.verified_gif : cfg.x_mark_gif })
          .setDescription(title ? desc : null);
        break;

      case 'string':
        if (emoji.checkURL()) embed.setAuthor({ name: author, iconURL: emoji }).setDescription(title ? desc : null);
        else {
          emoji = `\\${emoji} `;
          embed.setTitle(title ? emoji + author : null).setDescription((title ? '' : emoji) + desc);
        }
        break;

      default:
        break;
    }

    return { embeds: [embed], ...(flags && { flags: MessageFlags.Ephemeral }) };
  };
};
