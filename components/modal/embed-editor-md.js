const { EmbedBuilder, Client, Interaction } = require('discord.js');
const { checkURL } = require('../../functions/common/utilities');
module.exports = {
  data: { name: 'embed-editor-md' },
  /**
   * Edit Embed Modal
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed, user: bot } = client;
    const { fields, channel } = interaction;
    const msgid = fields.getTextInputValue('msgid');
    const title = fields.getTextInputValue('title');
    const description = fields.getTextInputValue('description');
    const thumbnailURL = fields.getTextInputValue('thumbnailURL');
    const imageURL = fields.getTextInputValue('imageURL');
    let msgEdit = await channel.messages.fetch(msgid).catch(() => undefined);

    if (msgEdit === undefined)
      return await interaction.reply(errorEmbed(true, `Message ID \`${msgid}\` is incorrect!`));

    if (msgEdit.author.id !== bot.id)
      return await interaction.reply(
        errorEmbed(true, `This message [\`${msgid}\`](${msgEdit.url}) does not belong to ${bot}!`),
      );

    const embed = msgEdit.embeds[0];
    const embedEdit = EmbedBuilder.from(embed)
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(checkURL(thumbnailURL) ? thumbnailURL : null)
      .setImage(checkURL(imageURL) ? imageURL : null);

    await msgEdit.edit({ embeds: [embedEdit] }).then(async () => {
      await interaction.reply(errorEmbed(false, `Embed edited [\`${msgid}\`](${msgEdit.url}) successfully!`));
    });
  },
};
