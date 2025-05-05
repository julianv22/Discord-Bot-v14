const mongoose = require('mongoose');
const thanksProfile = new mongoose.Schema({
  guildID: { type: String, required: true },
  guildName: { type: String },
  userID: { type: String, required: true },
  usertag: { type: String },
  thanksCount: { type: Number, default: 0 },
  lastThanks: { type: Date },
});

module.exports = mongoose.model('thanksProfile', thanksProfile, `thanksProfile [${cfg.mongodb}] - ${cfg.clientID}`);
