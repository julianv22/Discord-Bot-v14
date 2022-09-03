const serverProfile = require('../../config/serverProfile');
const { EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: { name: 'suggest-md' },
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    let profile = await serverProfile.findOne({ guildID: guild.id });
    if (!profile || !profile?.suggestChannel)
      return interaction.reply({
        embeds: [
          {
            color: 16711680,
            description: `\\❌ | This server hasn't been setup Suggest Channel. Please contact the ${cfg.adminRole}'s team`,
          },
        ],
        ephemeral: true,
      });

    const sgtChannel = await client.channels.cache.get(profile?.suggestChannel);
    const content = interaction.fields.getTextInputValue('content');
    const embed = new EmbedBuilder()
      .setAuthor({ name: `${user.tag}'s suggestions`, iconURL: user.displayAvatarURL(true) })
      .setTitle(`Suggest's content:`)
      .setDescription(content)
      .setColor('Yellow')
      .setThumbnail(cfg.suggestPNG)
      .setTimestamp()
      .setFooter({ text: guild.name, iconURL: guild.iconURL(true) });

    const msg = await sgtChannel.send({ embeds: [embed] });
    msg.channel.send(`\`❗ | Đề xuất sẽ được xem xét và trả lời sớm nhất!\``).then(m => {
      m.react('👍');
      m.react('👎');
    });

    await interaction.reply({
      embeds: [{ color: 65280, description: `\\✅ Your suggestions has been send successfully! [[Jump link](${msg.url})]` }],
      ephemeral: true,
    });
  },
};
