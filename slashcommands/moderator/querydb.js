const { readdirSync } = require('fs');
const profiles = readdirSync('./config').filter((f) => f.endsWith('Profile.js'));
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
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('querydb')
    .setDescription(`\⭕wner only`)
    .addStringOption((opt) =>
      opt
        .setName('profile')
        .setDescription('Choose which profile type to query')
        .setRequired(true)
        .addChoices(profiles.map((p) => ({ name: p.split('.')[0], value: p.split('.')[0] }))),
    ),
  /**
   * Query database
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 64 });
    const { errorEmbed } = client;
    const { guild, guildId, user, options } = interaction;
    const choice = options.getString('profile');
    const serverProfile = require(`../../config/${choice}`);
    if (user.id !== cfg.ownerID)
      return await interaction.reply(errorEmbed({ description: '\\⭕wner permission only', emoji: false }));
    let profile = await serverProfile.find({ guildID: guildId }).catch(() => {});
    if (!profile) return await interaction.reply(errorEmbed({ description: 'No database!', emoji: false }));
    /**
     * Send a message
     * @param {string} message - Nội dung message
     * @param {string} key - Key của sourcebin
     */
    async function sendMessage(message, key) {
      const embed = new EmbedBuilder().setColor('Blurple').setDescription(message);

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

    let db = JSON.stringify(profile, null, 2);
    let bin = await fetch('https://sourceb.in/api/bins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: [{ content: `${guild.name} **${choice}** database:\n\n${db}` }],
      }),
    });

    if (bin.ok) {
      let { key } = await bin.json();
      await sendMessage(`\\✅ Parse ${guild.name} **${choice}** database successfully!`, key)
        .then(async () => {
          for (let i = 0; i < db.length; i += 2000) {
            await interaction.followUp?.({ content: `\`\`\`json\n${db.slice(i, i + 2000)}\`\`\``, flags: 64 });
          }
        })
        .catch((e) => {
          console.error(chalk.red('Error (querydb):', e));
        });
    } else
      await interaction.editReply(
        errorEmbed({ description: 'Can not parse sourcebin now. Try again later!', emoji: false }),
      );
  },
};
