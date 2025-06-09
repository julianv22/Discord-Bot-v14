const mongoose = require('mongoose');

const serverProfile = new mongoose.Schema({
  guildID: { type: String, required: true, unique: true },
  guildName: { type: String },
  prefix: { type: String },
  setup: {
    suggest: { type: String },
    starboard: {
      channel: { type: String },
      star: { type: Number },
      messages: { type: Object, default: {} },
    },
    welcome: {
      channel: { type: String },
      message: { type: String },
      log: { type: String },
    },
  },
  statistics: {
    totalChannel: { type: String },
    memberChannel: { type: String },
    botChannel: { type: String },
    presenceChannel: { type: String },
  },
  youtube: {
    channels: { type: Array },
    lastVideos: { type: Array },
    notifyChannel: { type: String },
    alert: { type: String },
  },
  tournament: {
    id: { type: String },
    name: { type: String },
    status: { type: Boolean },
  },
});

module.exports = mongoose.model('serverProfile', serverProfile, `serverProfile [${cfg.mongodb}] - ${cfg.clientID}`);
