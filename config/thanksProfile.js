const mongoose = require('mongoose');
const thanksProfile = new mongoose.Schema({
  guildID: { type: String, required: true },
  guildName: { type: String },
  userID: { type: String, required: true, unique: true },
  usertag: { type: String },
  thanksCount: { type: Number, default: 0 },
  lastThanks: { type: Date },
});

thanksProfile.index({ guildID: 1, userID: 1 });

module.exports = mongoose.model('thanksProfile', thanksProfile, `thanksProfile [${cfg.mongodb}] - ${cfg.clientID}`);
