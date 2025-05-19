const { SlashCommandBuilder, Interaction, Client } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('Hacking someone! J4F 😝')
    .addUserOption((opt) => opt.setName('target').setDescription('Đối tượng muốn hack!').setRequired(true)),
  category: 'misc',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, options } = interaction;
    const target = options.getUser('target');

    // Validate context
    if (!target) return interaction.reply(errorEmbed(true, 'Target user not found!'));
    if (!guild) return interaction.reply(errorEmbed(true, 'Lệnh này chỉ dùng trong server!'));
    if (target.id === user.id) return interaction.reply(errorEmbed(true, 'Ngu dốt! Không thể hack chính mình 😅!'));
    if (target.id === guild.ownerId)
      return interaction.reply(errorEmbed(true, 'Không động được vào thằng này đâu nhá!'));
    if (target.id === cfg.clientID) return interaction.reply(errorEmbed(true, 'Are you sure 🤔⁉️'));

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
    setTimeout(() => {
      interaction.editReply(process1[randomProcess1]).catch(() => {});
    }, 1500);
    setTimeout(() => {
      interaction.editReply(process2[randomProcess2]).catch(() => {});
    }, 2500);
    setTimeout(() => {
      interaction.editReply(process3[randomProcess3]).catch(() => {});
    }, 3500);
    setTimeout(() => {
      interaction.editReply(processEnd).catch(() => {});
    }, 4500);
    setTimeout(() => {
      interaction.editReply(endText).catch(() => {});
    }, 5500);
    setTimeout(() => {
      interaction.editReply(result).catch(() => {});
    }, 6000);
  },
};
