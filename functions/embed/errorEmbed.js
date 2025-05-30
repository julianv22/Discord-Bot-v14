const { EmbedBuilder, MessageFlags } = require('discord.js');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Create an error embed
   * @param {string} title - The title of the embed
   * @param {string} description - The description of the embed
   * @param {string} error - The error if has occurred
   * @param {string} color - The color of the embed
   * @param {boolean} emoji - Whether to use an emoji prefix
   * @param {boolean} flags - Whether to use flags
   */
  client.errorEmbed = ({ title, description, error, color = 'Random', emoji = '', flags = true }) => {
    const embed = new EmbedBuilder();
    if (title) embed.setTitle(title);
    let prefix = '';

    if (typeof emoji === 'boolean') {
      prefix = emoji ? `\\✅ | ` : `\\❌ | `;
      embed.setColor(emoji ? 'Green' : 'Red');
    } else {
      prefix = emoji;
      embed.setColor(color);
    }

    const desc = prefix + description + (error ? `\`\`\`fix\n${error}\`\`\`` : '');
    embed.setDescription(desc);

    return { embeds: [embed], ...(flags && { flags: MessageFlags.Ephemeral }) };
  };
};
