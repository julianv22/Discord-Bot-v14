const { Events, MessageReaction, User } = require('discord.js');
const reactionRole = require('../../config/reactionRole');
const { starReactionAdd } = require('../../functions/common/starboardReaction');

module.exports = {
  name: Events.MessageReactionAdd,
  /** - MessageReaction Add Event
   * @param {MessageReaction} reaction - Message Reaction object
   * @param {User} user - User object */
  async execute(reaction, user) {
    if (user.bot) return;

    const { message, emoji } = reaction;
    const { guild, channelId, id: messageId } = message;
    const { id: guildId, name: guildName, members } = guild;

    if (!guild) return;

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
        return console.error(chalk.red('Failed to fetch partial reaction\n'), e);
      }
    }

    if (message.partial) {
      try {
        await message.fetch();
      } catch (e) {
        return console.error(chalk.red('Failed to fetch partial message from reaction\n'), e);
      }
    }

    if (emoji.name === '⭐') {
      const starReaction = message.reactions.cache.get('⭐');
      const count = starReaction ? starReaction.count : 0;
      if (count === 0) return;

      return await starReactionAdd(message, user.id, count);
    }

    const member = await members.fetch(user.id);
    const bot = members.me;
    const config = await reactionRole.findOne({ guildId, channelId, messageId }).catch(console.error);

    if (!config) return; // Return if config or roles is not valid or not an array

    let reactEmoji = emoji.name;

    if (emoji.id) reactEmoji = `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`; // Corrected emoji format

    const roleObj = config.roles.find((r) => r.emoji === reactEmoji || r.emoji === emoji.id);

    if (roleObj) {
      try {
        const role = guild.roles.cache.get(roleObj.roleId);
        if (role) {
          if (role.position >= bot.roles.highest.position)
            return console.error(chalk.red(`Bot can not remove role for ${user.tag}`));

          if (!member.roles.cache.has(role.id)) await member.roles.add(role.id);
        } else console.warn(chalk.yellow(`Role ID ${roleObj.roleId} is undefined in ${guildName}`));
      } catch (e) {
        console.error(chalk.red(`Error while adding role to ${member.user.tag}\n`), e);
      }
    }
  },
};
