const { Client, Message } = require('discord.js');

module.exports = {
  name: 'hack',
  aliases: [],
  description: 'Hack ai đó! J4F 😝',
  category: 'misc',
  cooldown: 0,
  /** - Hack someone
   * @param {Message} message - Message
   * @param {string[]} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const { errorEmbed, commandUsage } = client;
    const { mentions, guild, author } = message;
    if (args.join(' ').trim() === '?') return await commandUsage(message, this, prefix + this.name + ' @user');

    const target = mentions.members.first() || guild.members.cache.get(args[0]);
    if (!target)
      return await message
        .reply(errorEmbed({ desc: 'Phải @ đến nạn nhân để hack 🤣!' }))
        .then((m) => setTimeout(async () => await m.delete().catch(console.error), 10000));

    if (target.id === author.id)
      return await message
        .reply(errorEmbed({ desc: 'Ngu dốt! Không thể hack chính mình 😅!' }))
        .then((m) => setTimeout(async () => await m.delete().catch(console.error), 10000));

    if (target.id === guild.ownerId)
      return await message
        .reply(errorEmbed({ desc: 'Không động được vào thằng này đâu nhá! 🎭' }))
        .then((m) => setTimeout(async () => await m.delete().catch(console.error), 10000));

    if (target.id === cfg.clientID)
      return await message
        .reply(errorEmbed({ desc: 'Are you sure 🤔' }))
        .then((m) => setTimeout(async () => await m.delete().catch(console.error), 10000));

    const username = target.displayName || target.user?.tag || target.id,
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
      randomProcess3 = Math.floor(Math.random() * process3.length),
      msg = await message.reply(text[randomText]);

    setTimeout(async () => {
      await msg.edit(process1[randomProcess1]);
    }, 1500);
    setTimeout(async () => {
      await msg.edit(process2[randomProcess2]);
    }, 2500);
    setTimeout(async () => {
      await msg.edit(process3[randomProcess3]);
    }, 3500);
    setTimeout(async () => {
      await msg.edit(processEnd);
    }, 4500);
    setTimeout(async () => {
      await msg.edit(endText);
    }, 5500);
    setTimeout(async () => {
      await msg.edit(result);
    }, 6000);
  },
};
