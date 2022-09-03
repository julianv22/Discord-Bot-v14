const { Message, Client } = require('discord.js');

module.exports = {
  name: 'hack',
  aliases: [],
  description: 'Hack ai đó! J4F 😝',
  category: 'fun',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { mentions, guild, author } = message;
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, null, prefix + this.name + ' <user>');

    const target = mentions.members.first() || guild.members.cache.get(args[0]);
    if (!target)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Phải @ đến nạn nhân để hack 🤣!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    if (target.id === author.id)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Ngu dốt! Không thể hack chính mình 😅!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    if (target.id === guild.ownerId)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Không động được vào thằng này đâu nhá! \\🎭` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    if (target.id === cfg.clientID)
      return message.reply({ embeds: [{ color: 16711680, description: `⁉️ | Are you sure 🤔` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    let username = target.user.tag;
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
    const msg = await message.reply(text[randomText]);
    setTimeout(() => {
      msg.edit(process1[randomProcess1]);
    }, 1500);
    setTimeout(() => {
      msg.edit(process2[randomProcess2]);
    }, 2500);
    setTimeout(() => {
      msg.edit(process3[randomProcess3]);
    }, 3500);
    setTimeout(() => {
      msg.edit(processEnd);
    }, 4500);
    setTimeout(() => {
      msg.edit(endText);
    }, 5500);
    setTimeout(() => {
      msg.edit(result);
    }, 6000);
  },
};
