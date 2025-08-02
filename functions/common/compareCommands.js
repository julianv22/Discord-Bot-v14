const _ = require('lodash');
const { logError } = require('./logging');

module.exports = {
  /** - Compares two command objects to check if they are structurally identical.
   * @param {object} localCommand The command defined locally (after toJSON()).
   * @param {object} remoteCommand The command fetched from the Discord API.
   * - Returns true if the commands are different, otherwise returns false. */
  commandsAreDifferent: (localCommand, remoteCommand) => {
    // Helper function to normalize option properties for consistent comparison
    const normalizeOption = (opt) => {
      const normalized = {};
      // Assign properties in a fixed order to ensure consistent comparison
      normalized.type = opt.type;
      normalized.name = opt.name;
      normalized.description = (opt.description || '').trim();
      normalized.required = opt.required || false;
      normalized.autocomplete = opt.autocomplete || false;
      // Normalize type-specific properties
      if (opt.type === 4 || opt.type === 10) {
        // INTEGER or NUMBER type
        normalized.min_value = opt.min_value === undefined ? null : opt.min_value;
        normalized.max_value = opt.max_value === undefined ? null : opt.max_value;
      } else {
        normalized.min_value = null;
        normalized.max_value = null;
      }
      if (opt.type === 3 || opt.type === 4)
        // STRING or INTEGER type
        normalized.choices = opt.choices || [];
      else normalized.choices = [];

      if (opt.type === 7)
        // CHANNEL type
        normalized.channel_types = opt.channel_types || [];
      else normalized.channel_types = [];

      // Normalize localization fields
      normalized.name_localizations = opt.name_localizations || null;
      normalized.description_localizations = opt.description_localizations || null;
      // Recursively normalize and sort nested options
      if (opt.options && Array.isArray(opt.options))
        normalized.options = _.sortBy(opt.options.map(normalizeOption), 'name');
      else normalized.options = [];

      // Handle the 'only' keyword for description after trimming
      if (typeof normalized.description === 'string' && normalized.description.toLowerCase().includes('only'))
        normalized.description = 'ONLY_KEYWORD_PRESENT';

      return normalized;
    };
    // 1. Normalize, sort, and compare options
    const localOptions = (localCommand.options || []).map(normalizeOption);
    const remoteOptions = (remoteCommand.options || []).map(normalizeOption);
    // Sort options by name to ensure consistent comparison order, regardless of API return order
    const sortedLocalOptions = _.sortBy(localOptions, 'name');
    const sortedRemoteOptions = _.sortBy(remoteOptions, 'name');

    if (JSON.stringify(sortedLocalOptions) !== JSON.stringify(sortedRemoteOptions)) return true;

    // 2. Compare description
    // If description contains "only", ignore this comparison
    const localDescription = localCommand.description || '';
    const remoteDescription = remoteCommand.description || '';

    const containsOnly = (desc) => typeof desc === 'string' && desc.toLowerCase().includes('only');

    if (!containsOnly(localDescription) && !containsOnly(remoteDescription))
      if (localDescription !== remoteDescription) return true;

    // 3. Compare default member permissions (normalize to string to avoid number vs string errors)
    const localPerms = localCommand.default_member_permissions?.toString() || null;
    const remotePerms = remoteCommand.default_member_permissions?.toString() || null;
    if (localPerms !== remotePerms) return true;

    // 4. Compare DM permission (normalize undefined to true)
    const localDmPermission = localCommand.dm_permission === undefined ? true : localCommand.dm_permission;
    const remoteDmPermission = remoteCommand.dm_permission === undefined ? true : remoteCommand.dm_permission; // Ensure remote is also normalized
    if (localDmPermission !== remoteDmPermission) return true;

    // 5. Compare NSFW (normalize undefined to false)
    const localNsfw = localCommand.nsfw === undefined ? false : localCommand.nsfw;
    const remoteNsfw = remoteCommand.nsfw === undefined ? false : remoteCommand.nsfw;
    if (localNsfw !== remoteNsfw) return true;

    // 6. Compare category
    const localCategory = localCommand.category || null;
    const remoteCategory = remoteCommand.category || null;
    if (localCategory !== remoteCategory) return true;

    // 7. Compare scooldown
    const localScooldown = localCommand.scooldown || null;
    const remoteScooldown = remoteCommand.scooldown || null;
    if (localScooldown !== remoteScooldown) return true;

    // 8. Compare Parent
    const localParent = localCommand.parent || null;
    const remoteParent = remoteCommand.parent || null;
    if (localParent !== remoteParent) return true;

    return false;
  },
  /** - Compares local commands with registered commands on Discord and logs the changes.
   * @param {Array<object>} localCommands An array of locally defined commands.
   * @param {Array<object>} remoteCommands An array of commands fetched from the Discord API. */
  compareCommands: (localCommands, remoteCommands) => {
    const localCommandsMap = new Map(localCommands.map((cmd) => [cmd.name, cmd]));
    const remoteCommandsMap = new Map(remoteCommands.map((cmd) => [cmd.name, cmd]));

    const newCommands = [];
    const deletedCommands = [];
    const changedCommands = [];

    try {
      // Check for NEW and CHANGED commands
      for (const [name, localCommand] of localCommandsMap) {
        const remoteCommand = remoteCommandsMap.get(name);

        if (!remoteCommand) newCommands.push(name);
        else {
          if (module.exports.commandsAreDifferent(localCommand, remoteCommand)) changedCommands.push(name);
        }
      }

      // Check for DELETED commands
      for (const name of remoteCommandsMap.keys()) {
        if (!localCommandsMap.has(name)) deletedCommands.push(name);
      }

      // Log results
      if (newCommands.length > 0) {
        console.log(
          chalk.yellow(`[NEW] Added ${newCommands.length} command${newCommands.length > 1 ? 's' : ''}: `) +
            chalk.green(newCommands.join(', '))
        );
      }
      if (deletedCommands.length > 0) {
        console.log(
          chalk.yellow(
            `[DELETED] Removed ${deletedCommands.length} command${deletedCommands.length > 1 ? 's' : ''}: `
          ) + chalk.green(deletedCommands.join(', '))
        );
      }
      if (changedCommands.length > 0) {
        console.log(
          chalk.yellow(
            `[MODIFIED] Updated ${changedCommands.length} command${changedCommands.length > 1 ? 's' : ''}: `
          ) + chalk.green(changedCommands.join(', '))
        );
      }

      // if (!newCommands.length && !deletedCommands.length && !changedCommands.length) {
      //   console.log('No changes detected between local and remote commands.');
      // }
    } catch (e) {
      logError({ item: 'compareCommands', desc: 'function' }, e);
    }
  },
};
