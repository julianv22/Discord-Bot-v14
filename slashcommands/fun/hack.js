const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'fun',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('Hacking someone! J4F 😝')
    .addUserOption((opt) => opt.setName('target').setDescription('Đối tượng muốn hack!').setRequired(true)),
  /** - Hack someone! J4F 😝
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed } = client;
    const target = options.getUser('target');

    // Validate context
    if (!target) return await interaction.reply(errorEmbed({ desc: 'Target user not found!' }));
    if (!guild) return await interaction.reply(errorEmbed({ desc: 'Lệnh này chỉ dùng trong server!' }));
    if (target.id === user.id)
      return await interaction.reply(errorEmbed({ desc: 'Ngu dốt! Không thể hack chính mình 😅!' }));
    if (target.id === guild.ownerId)
      return await interaction.reply(errorEmbed({ desc: 'Không động được vào thằng này đâu nhá!' }));
    if (target.id === cfg.clientID) return await interaction.reply(errorEmbed({ desc: 'Are you sure 🤔⁉️' }));

    const username = target.displayName || target.tag || 'Unknown',
      text = [
        `\`\`\`diff\n+ Hacking ${username}...\n\`\`\``,
        `\`\`\`diff\n+ Getting ${username}'s token...\n\`\`\``,
        `\`\`\`diff\n+ Sending virus to ${username}...\n\`\`\``,
        `\`\`\`diff\n+ Accessing ${username}'s IP Address...\n\`\`\``,
      ],
      process1 = [
        `\`\`\`diff\n+ [#_________] 14% complete\n\`\`\``,
        `\`\`\`diff\n+ [##________] 26% complete\n\`\`\``,
        `\`\`\`diff\n+ [###_______] 32% complete\n\`\`\``,
      ],
      process2 = [
        `\`\`\`diff\n+ [####______] 41% complete\n\`\`\``,
        `\`\`\`diff\n+ [#####_____] 53% complete\n\`\`\``,
        `\`\`\`diff\n+ [######____] 67% complete\n\`\`\``,
      ],
      process3 = [
        `\`\`\`diff\n+ [#######___] 72% complete\n\`\`\``,
        `\`\`\`diff\n+ [########__] 84% complete\n\`\`\``,
        `\`\`\`diff\n+ [#########_] 93% complete\n\`\`\``,
      ],
      processEnd = `\`\`\`diff\n+ [##########] 100% complete\n\`\`\``,
      endText = `\`\`\`diff\n+ Process exited [exit code 0]\n\`\`\``,
      result = `\`\`\`diff\n+ ${username} has been hacked successfully! ✅\n\`\`\``,
      randomText = Math.floor(Math.random() * text.length),
      randomProcess1 = Math.floor(Math.random() * process1.length),
      randomProcess2 = Math.floor(Math.random() * process2.length),
      randomProcess3 = Math.floor(Math.random() * process3.length);

    await interaction.reply(text[randomText]);
    setTimeout(async () => {
      await interaction.editReply(process1[randomProcess1]);
    }, 1500);
    setTimeout(async () => {
      await interaction.editReply(process2[randomProcess2]);
    }, 2500);
    setTimeout(async () => {
      await interaction.editReply(process3[randomProcess3]);
    }, 3500);
    setTimeout(async () => {
      await interaction.editReply(processEnd);
    }, 4500);
    setTimeout(async () => {
      await interaction.editReply(endText);
    }, 5500);
    setTimeout(async () => {
      await interaction.editReply(result);
    }, 6000);
  },
};
