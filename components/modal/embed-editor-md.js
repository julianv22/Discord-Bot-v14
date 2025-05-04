const { EmbedBuilder, Client, Interaction } = require("discord.js");

module.exports = {
  data: { name: "embed-editor-md" },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { checkURL, user: bot } = client;
    const { fields, channel } = interaction;
    const msgid = fields.getTextInputValue("msgid");
    const title = fields.getTextInputValue("title");
    const description = fields.getTextInputValue("description");
    const thumbnailURL = fields.getTextInputValue("thumbnailURL");
    const imageURL = fields.getTextInputValue("imageURL");
    let msgEdit = await channel.messages.fetch(msgid).catch(() => undefined);

    if (msgEdit === undefined)
      return interaction.reply({
        embeds: [
          {
            color: 16711680,
            description: `\\❌ | Message ID \`${msgid}\` is incorrect!`,
          },
        ],
        ephemeral: true,
      });

    if (msgEdit.author.id !== bot.id)
      return interaction.reply({
        embeds: [
          {
            color: 16711680,
            description: `\\❌ | This message [\`${msgid}\`](${msgEdit.url}) does not belong to ${bot}!`,
          },
        ],
        ephemeral: true,
      });

    const embed = msgEdit.embeds[0];
    const embedEdit = EmbedBuilder.from(embed)
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(checkURL(thumbnailURL) ? thumbnailURL : null)
      .setImage(checkURL(imageURL) ? imageURL : null);

    await msgEdit.edit({ embeds: [embedEdit] }).then(() => {
      interaction.reply({
        embeds: [
          {
            color: 65280,
            description: `\\✅ | Embed edited [\`${msgid}\`](${msgEdit.url}) successfully!`,
          },
        ],
        ephemeral: true,
      });
    });
  },
};
