const reactionRole = require('../../config/reactionRole');

module.exports = {
  name: 'messageReactionRemove',
  /**
   * @param {MessageReaction} reaction
   * @param {User} user
   */
  async execute(reaction, user) {
    if (user.bot) return;

    const { message, emoji } = reaction;
    const { guild, channel } = message;

    if (!guild) return;

    if (reaction.partial) await reaction.fetch();

    const member = await guild.members.fetch(user.id);
    const bot = guild.members.me;
    const config = await reactionRole
      .findOne({
        guildID: guild.id,
        channelId: channel.id,
        messageId: message.id,
      })
      .catch(console.error); // Keep catch for findOne errors

    if (!config) return; // Return if config or roles is not valid or not an array

    let reactEmoji = emoji.name;

    if (emoji.id) {
      reactEmoji = `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`; // Corrected emoji format
    }

    const roleObj = config.roles.find((r) => r.emoji === reactEmoji || r.emoji === emoji.id);

    if (roleObj) {
      try {
        const role = guild.roles.cache.get(roleObj.roleId);

        if (role) {
          if (role.position >= bot.roles.highest.position)
            return console.error(chalk.red(`Bot cannot remove role for ${user.displayName}`));

          if (member.roles.cache.has(role.id)) await member.roles.remove(role.id);
        } else console.warn(chalk.yellow(`Role ID ${roleObj.roleId} is undefined in ${guild.name}`));
      } catch (e) {
        console.error(chalk.red(`Error while adding role to ${member.user.tag}`, e));
      }
    }
  },
};
