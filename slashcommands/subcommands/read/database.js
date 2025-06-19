const {
  SlashCommandSubcommandBuilder,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  category: 'sub command',
  parent: 'read',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('database'),

  /** Read database from MongoDB
   * @param {ChatInputCommandInteraction} interaction - Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed, catchError } = client;
    const choice = options.getString('profile');
    const owner = await guild.fetchOwner();
    const serverProfile = require(`../../../config/${choice}`);

    await interaction.deferReply({ flags: 64 });

    if (user.id !== cfg.ownerID && user.id !== owner.id)
      return await interaction.editReply(errorEmbed({ desc: 'Owner permission only', emoji: false }));

    /**
     * Send a message
     * @param {string} message - Nội dung message
     * @param {string} key - Key của sourcebin
     */
    const sendMessage = async (message, key) => {
      const embed = new EmbedBuilder().setColor(Colors.Blurple).setDescription(message);

      if (key)
        await interaction.editReply({
          embeds: [embed],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(`https://sourceb.in/${key}`)
                .setLabel('🔗 View Database'),
            ),
          ],
        });
      else await interaction.editReply({ embeds: [embed] });
    };
    try {
      const profile = await serverProfile.find({ guildID: guild.id }).catch(console.error);

      if (!profile) return await interaction.reply(errorEmbed({ desc: 'No database!', emoji: false }));

      const db = JSON.stringify(profile, null, 2);
      const bin = await fetch('https://sourceb.in/api/bins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: [{ content: `${guild.name} **${choice}** database:\n\n${db}` }],
        }),
      });

      if (bin.ok) {
        const { key } = await bin.json();
        await sendMessage(`\\✅ Parse ${guild.name} **${choice}** database successfully!`, key)
          .then(async () => {
            for (let i = 0; i < db.length; i += 2000) {
              await interaction.followUp?.({ content: `\`\`\`json\n${db.slice(i, i + 2000)}\`\`\``, flags: 64 });
            }
          })
          .catch(console.error);
      } else
        await interaction.editReply(
          errorEmbed({ desc: 'Can not parse sourcebin now. Try again later!', emoji: false }),
        );
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
