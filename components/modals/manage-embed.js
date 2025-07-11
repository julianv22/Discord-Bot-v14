const { Client, ModalMessageModalSubmitInteraction, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { replaceVar } = require('../../functions/common/utilities');

module.exports = {
  type: 'modals',
  data: { name: 'manage-embed' },
  /** - Embed Modal
   * @param {ModalMessageModalSubmitInteraction} interaction Modal Message Modal Submit Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { customId, fields, message, user, guild } = interaction;
    const [, input] = customId.split(':');
    const strInput = fields.getTextInputValue(input);
    const embed = EmbedBuilder.from(message.embeds[0]);
    const Button0 = ActionRowBuilder.from(message.components[0]);
    const Button1 = ActionRowBuilder.from(message.components[1]);
    const replaceKey = {
      user: user.displayName || user.username,
      guild: guild.name,
      iconURL: guild.iconURL(),
      avatar: user.avatarURL(),
    };

    if (!message) return await interaction.reply(client.errorEmbed({ desc: 'Không tìm thấy tin nhắn!' }));

    const truncateString = (str, maxLength) => (str.length > maxLength ? str.slice(0, maxLength) : str);

    const editEmbed = {
      author: () => {
        const authorIcon = fields.getTextInputValue('authorIcon');
        const iconURL = replaceVar(authorIcon, replaceKey);

        return embed.setAuthor({
          name: replaceVar(truncateString(strInput, 256), replaceKey) || null,
          iconURL: iconURL.checkURL() ? iconURL : null,
        });
      },
      title: () => {
        return embed.setTitle(truncateString(strInput, 256));
      },
      description: () => {
        return embed.setDescription(replaceVar(truncateString(strInput, 4096), replaceKey));
      },
      color: () => {
        return embed.setColor(strInput.toEmbedColor());
      },
      image: () => {
        return embed.setImage(strInput && strInput.checkURL() ? strInput : null);
      },
      thumbnail: () => {
        return embed.setThumbnail(strInput && strInput.checkURL() ? strInput : null);
      },
      footer: async () => {
        const footerIcon = fields.getTextInputValue('footerIcon');
        const iconUrl = replaceVar(footerIcon, replaceKey);

        return embed.setFooter({
          text: replaceVar(truncateString(strInput, 2048), replaceKey) || null,
          iconURL: iconUrl.checkURL() ? iconUrl : 'https://www.gstatic.com/webp/gallery3/2_webp_ll.webp', // Changed to null, as a default static URL might not be desired.
        });
      },
    };

    if (!editEmbed[input]) {
      client.catchError(
        interaction,
        new Error(chalk.yellow("Invalid Modal's customId ") + chalk.green(input)),
        'Lỗi Modal Embed'
      );
      return await interaction.reply(client.errorEmbed({ desc: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.' }));
    }
    await editEmbed[input]();

    return await interaction.update({ embeds: [embed], components: [Button0, Button1] });
  },
};
