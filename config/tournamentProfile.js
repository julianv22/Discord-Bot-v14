const mongoose = require('mongoose');
const tournamentProfile = new mongoose.Schema({
  guildID: { type: String, required: true },
  guildName: { type: String },
  userID: { type: String, required: true },
  usertag: { type: String },
  ingame: { type: String },
  decklist: { type: String },
  status: { type: Boolean },
});

module.exports = mongoose.model(
  'tournamentProfile',
  tournamentProfile,
  `tournamentProfile [${cfg.mongodb}] - ${cfg.clientID}`,
);
