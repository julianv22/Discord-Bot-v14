const { SlashCommandBuilder, Interaction, Client } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('Hacking someone! J4F 😝')
    .addUserOption((opt) => opt.setName('target').setDescription('Đối tượng muốn hack!').setRequired(true)),
  /**
   * Hack someone! J4F 😝
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed } = client;
    const target = options.getUser('target');

    // Validate context
    if (!target) return await interaction.reply(errorEmbed({ description: 'Target user not found!', emoji: false }));
    if (!guild)
      return await interaction.reply(errorEmbed({ description: 'Lệnh này chỉ dùng trong server!', emoji: false }));
    if (target.id === user.id)
      return await interaction.reply(
        errorEmbed({ description: 'Ngu dốt! Không thể hack chính mình 😅!', emoji: false }),
      );
    if (target.id === guild.ownerId)
      return await interaction.reply(
        errorEmbed({ description: 'Không động được vào thằng này đâu nhá!', emoji: false }),
      );
    if (target.id === cfg.clientID)
      return await interaction.reply(errorEmbed({ description: 'Are you sure 🤔⁉️', emoji: false }));

    let username = target.displayName || target.tag || 'Unknown';
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
    setTimeout(async () => {
      await interaction.editReply(process1[randomProcess1]).catch(console.error);
    }, 1500);
    setTimeout(async () => {
      await interaction.editReply(process2[randomProcess2]).catch(console.error);
    }, 2500);
    setTimeout(async () => {
      await interaction.editReply(process3[randomProcess3]).catch(console.error);
    }, 3500);
    setTimeout(async () => {
      await interaction.editReply(processEnd).catch(console.error);
    }, 4500);
    setTimeout(async () => {
      await interaction.editReply(endText).catch(console.error);
    }, 5500);
    setTimeout(async () => {
      await interaction.editReply(result).catch(console.error);
    }, 6000);
  },
};
