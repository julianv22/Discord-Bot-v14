const { SlashCommandBuilder, Interaction, Client } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('Hack ai đó! J4F 😝')
    .addUserOption(opt => opt.setName('target').setDescription('Đối tượng muốn hack!').setRequired(true)),
  category: 'fun',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const target = options.getUser('target');

    if (target.id === user.id)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | Ngu dốt! Không thể hack chính mình 😅!` }],
        ephemeral: true,
      });

    if (target.id === guild.ownerId)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❌ | Không động được vào thằng này đâu nhá! \\🎭` }],
        ephemeral: true,
      });

    if (target.id === cfg.clientID) return interaction.reply({ embeds: [{ color: 16711680, description: `⁉️ | Are you sure 🤔` }], ephemeral: true });

    let username = target.tag;
    const text = [
      `\`\`\`diff\n+ Hacking ${username}...\n\`\`\``,
      `\`\`\`diff\n+ Getting ${username}'s token...\n\`\`\``,
      `\`\`\`diff\n+ Sending virus to ${username}...\n\`\`\``,
      `\`\`\`diff\n+ Accessing ${username}'s IP Address...\n\`\`\``,
    ];
    const process1 = [
      `\`\`\`diff\n+ [#_________] 14% complete\n\`\`\``,
      `\`\`\`diff\n+ [##________] 26% complete\n\`\`\``,
      `\`\`\`diff\n+ [###_______] 32% complete\n\`\`\``,
    ];
    const process2 = [
      `\`\`\`diff\n+ [####______] 41% complete\n\`\`\``,
      `\`\`\`diff\n+ [#####_____] 53% complete\n\`\`\``,
      `\`\`\`diff\n+ [######____] 67% complete\n\`\`\``,
    ];
    const process3 = [
      `\`\`\`diff\n+ [#######___] 72% complete\n\`\`\``,
      `\`\`\`diff\n+ [########__] 84% complete\n\`\`\``,
      `\`\`\`diff\n+ [#########_] 93% complete\n\`\`\``,
    ];
    const processEnd = `\`\`\`diff\n+ [##########] 100% complete\n\`\`\``;
    const endText = `\`\`\`diff\n+ Process exited [exit code 0]\n\`\`\``;
    const result = `\`\`\`diff\n+ ${username} has been hacked successfully! ✅\n\`\`\``;

    const randomText = Math.floor(Math.random() * text.length);
    const randomProcess1 = Math.floor(Math.random() * process1.length);
    const randomProcess2 = Math.floor(Math.random() * process2.length);
    const randomProcess3 = Math.floor(Math.random() * process3.length);

    await interaction.reply(text[randomText]);
    setTimeout(() => {
      interaction.editReply(process1[randomProcess1]);
    }, 1500);
    setTimeout(() => {
      interaction.editReply(process2[randomProcess2]);
    }, 2500);
    setTimeout(() => {
      interaction.editReply(process3[randomProcess3]);
    }, 3500);
    setTimeout(() => {
      interaction.editReply(processEnd);
    }, 4500);
    setTimeout(() => {
      interaction.editReply(endText);
    }, 5500);
    setTimeout(() => {
      interaction.editReply(result);
    }, 6000);
  },
};
