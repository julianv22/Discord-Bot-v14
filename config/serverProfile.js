const mongoose = require('mongoose');

const serverProfile = new mongoose.Schema({
  guildID: { type: String, required: true, unique: true },
  guildName: { type: String },
  prefix: { type: String },
  reportChannel: { type: String },
  updateChannel: { type: String },
  suggestChannel: { type: String },
  welcomeChannel: { type: String },
  welcomeMessage: { type: String },
  youtubeNotifyChannel: { type: String },
  logChannel: { type: String },
  tourID: { type: String },
  tourName: { type: String },
  tourStatus: { type: Boolean },
  totalChannel: { type: String },
  membersChannel: { type: String },
  memberRole: { type: String },
  botsChannel: { type: String },
  botRole: { type: String },
  statsChannel: { type: String },
  youtubeChannelIds: { type: Array },
  lastVideoIds: { type: Array },
  starboardChannel: { type: String },
  starCount: { type: Number },
  starboardMessages: { type: Object, default: {} },
});

module.exports = mongoose.model('serverProfile', serverProfile, `serverProfile [${cfg.mongodb}] - ${cfg.clientID}`);
