const mongoose = require('mongoose');
const tournamentProfile = new mongoose.Schema({
  guildID: { type: String, required: true },
  guildName: { type: String },
  userID: { type: String, required: true, unique: true },
  usertag: { type: String },
  ingame: { type: String },
  decklist: { type: String },
  status: { type: Boolean },
});

tournamentProfile.index({ guildID: 1, userID: 1 });

module.exports = mongoose.model(
  'tournamentProfile',
  tournamentProfile,
  `tournamentProfile [${cfg.mongodb}] - ${cfg.clientID}`,
);
