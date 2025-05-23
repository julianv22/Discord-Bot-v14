const serverProfile = require('../../config/serverProfile');
const {
  SlashCommandBuilder,
  Client,
  Interaction,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('querydb')
    .setDescription(`\⭕wner only`),
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  /**
   * Query database
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed, user } = client;
    const { guild, guildId } = interaction;

    // if (user.id !== cfg.ownerID) return interaction.reply(errorEmbed(true, '\\⭕wner permission only'));

    await interaction.deferReply({ ephemeral: true });

    // let profile = await serverProfile.find({});
    let profile = await serverProfile.findOne({ guildID: guildId }).catch(() => {});

    if (!profile) return interaction.reply(errorEmbed(true, 'No database!'));
    /**
     * Send a message
     * @param {string} message - Nội dung message
     * @param {string} key - Key của sourcebin
     */
    async function sendMessage(message, key) {
      const embed = new EmbedBuilder().setColor('Random').setDescription(message);

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
    }

    // let db = `${user.displayName || user.username}'s Database:\n`;
    // profile.forEach((p) => {
    //   db += `\n${JSON.stringify(p)}`;
    // });
    let db = JSON.stringify(profile, null, 2);

    let bin = await fetch('https://sourceb.in/api/bins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: [{ content: `${guild.name}'s Database:\n\n${db}` }],
      }),
    });

    if (bin.ok) {
      let { key } = await bin.json();
      await sendMessage(`\\✅ Parse ${guild.name}'s Database Successfully!`, key)
        .then(() => {
          for (let i = 0; i < db.length; i += 2000) {
            interaction.followUp?.({ content: `\`\`\`json\n${db.slice(i, i + 2000)}\`\`\``, ephemeral: true });
          }
          // interaction.followUp?.({ content: `\`\`\`json\n${JSON.stringify(profile, null, 2)}\`\`\``, ephemeral: true });
        })
        .catch((e) => {
          console.error(chalk.red('Error (querydb):', e));
        });
    } else await sendMessage(`\\❌ Can not parse sourcebin now. Try again later!`);
  },
};
