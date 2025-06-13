const {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
} = require('discord.js');
const { readdirSync } = require('fs');
const profiles = readdirSync('./config').filter((f) => f.endsWith('Profile.js'));

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('querydb')
    .setDescription('⭕wner only')
    .addStringOption((opt) =>
      opt
        .setName('profile')
        .setDescription('Choose which profile type to query')
        .setRequired(true)
        .addChoices(profiles.map((p) => ({ name: p.split('.')[0], value: p.split('.')[0] })))
        .addChoices({ name: 'reactionRole', value: 'reactionRole' }),
    ),
  /**
   * Query database
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed, catchError } = client;
    const choice = options.getString('profile');
    const owner = await guild.fetchOwner();
    const serverProfile = require(`../../config/${choice}`);

    await interaction.deferReply({ flags: 64 });

    if (user.id !== cfg.ownerID && user.id !== owner.id)
      return await interaction.editReply(errorEmbed({ description: 'Owner permission only', emoji: false }));

    try {
      let profile = await serverProfile.find({ guildID: guild.id }).catch(console.error);
      if (!profile) return await interaction.reply(errorEmbed({ description: 'No database!', emoji: false }));
      /**
       * Send a message
       * @param {String} message - Nội dung message
       * @param {String} key - Key của sourcebin
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
          .catch(console.error);
      } else
        await interaction.editReply(
          errorEmbed({ description: 'Can not parse sourcebin now. Try again later!', emoji: false }),
        );
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
