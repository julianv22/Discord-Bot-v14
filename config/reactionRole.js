const mongoose = require('mongoose');

const reactionRole = new mongoose.Schema({
  guildID: { type: String, required: true },
  guildName: { type: String },
  channelId: { type: String },
  messageId: { type: String, require: true, unique: true },
  roles: [
    {
      emoji: { type: String, require: true },
      roleId: { type: String, require: true },
    },
  ],
  title: { type: String },
  description: { type: String },
  createAt: { type: Date, default: Date.now },
});

reactionRole.index({ guildID: 1, messageId: 1 });

module.exports = mongoose.model('reactionRole', reactionRole, `reactionRole [${cfg.mongodb}] - ${cfg.clientID}`);
