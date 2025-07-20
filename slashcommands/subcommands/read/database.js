const { Client, Interaction, SlashCommandSubcommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { linkButton } = require('../../../functions/common/components');

module.exports = {
  ownerOnly: true,
  category: 'sub command',
  parent: 'read',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('database'),

  /** - Reads database from MongoDB.
   * @param {Interaction} interaction - Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, guildId, options } = interaction;
    const { errorEmbed } = client;
    const choice = options.getString('profile');
    const serverProfile = require(`../../../config/${choice}`);

    await interaction.deferReply({ flags: 64 });
    /** - Send a message
     * @param {string} message - Nội dung message
     * @param {string} key - Key của sourcebin
     */
    const sendMessage = async (message, key) => {
      const embeds = [new EmbedBuilder().setColor(Colors.Blurple).setDescription(message)];

      if (key)
        await interaction.editReply({
          embeds,
          components: [linkButton(`https://sourceb.in/${key}`, '🔗 View Database')],
        });
      else await interaction.editReply({ embeds });
    };

    const profile = await serverProfile.find({ guildId }).catch(console.error);
    if (!profile) return await interaction.reply(errorEmbed({ desc: 'No database found for this profile.' }));

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
    } else await interaction.editReply(errorEmbed({ desc: 'Could not parse sourcebin. Please try again later.' }));
  },
};
