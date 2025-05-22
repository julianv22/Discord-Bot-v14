const { EmbedBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: { name: 'embed-editor-md' },
  /**
   * Chỉnh sửa embed
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const { errorEmbed, checkURL, user: bot } = client;
    const { fields, channel } = interaction;
    const msgid = fields.getTextInputValue('msgid');
    const title = fields.getTextInputValue('title');
    const description = fields.getTextInputValue('description');
    const thumbnailURL = fields.getTextInputValue('thumbnailURL');
    const imageURL = fields.getTextInputValue('imageURL');
    let msgEdit = await channel.messages.fetch(msgid).catch(() => undefined);

    if (msgEdit === undefined) return interaction.reply(errorEmbed(true, `Message ID \`${msgid}\` is incorrect!`));

    if (msgEdit.author.id !== bot.id)
      return interaction.reply(
        errorEmbed(true, `This message [\`${msgid}\`](${msgEdit.url}) does not belong to ${bot}!`),
      );

    const embed = msgEdit.embeds[0];
    const embedEdit = EmbedBuilder.from(embed)
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(checkURL(thumbnailURL) ? thumbnailURL : null)
      .setImage(checkURL(imageURL) ? imageURL : null);

    await msgEdit.edit({ embeds: [embedEdit] }).then(() => {
      interaction.reply(errorEmbed(false, `Embed edited [\`${msgid}\`](${msgEdit.url}) successfully!`));
    });
  },
};
