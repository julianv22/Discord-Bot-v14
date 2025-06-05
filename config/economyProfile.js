const mongoose = require('mongoose');

const economyProfile = new mongoose.Schema({
  guildID: { type: String, required: true },
  guildName: { type: String },
  userID: { type: String, required: true, unique: true },
  usertag: { type: String },
  balance: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  inventory: { type: Array, default: [] },
  achievements: { type: Array, default: [] },
  dailyCooldown: { type: Date, default: null },
  lastWork: { type: String },
  lastRob: { type: Date, default: null },
  lastJob: { type: Date, default: null },
  totalEarned: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  lastDaily: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  lastPlayRPS: { type: Date, default: null },
  rpsCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('economyProfile', economyProfile, `economyProfile [${cfg.mongodb}] - ${cfg.clientID}`);
