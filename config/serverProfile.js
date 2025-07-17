const ServerProfileSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, unique: true, index: true, trim: true },
    guildName: { type: String, trim: true },
    prefix: { type: String, trim: true },
    suggest: { channelId: { type: String, trim: true } },
    starboard: {
      channelId: { type: String, trim: true },
      starCount: { type: Number, default: 3, min: 0, max: 20 },
      messages: { type: Object, default: {} },
    },
    welcome: {
      channelId: { type: String, trim: true },
      logChannelId: { type: String, trim: true },
      message: { type: String, trim: true },
    },
    statistics: {
      totalChannelId: { type: String, trim: true },
      memberChannelId: { type: String, trim: true },
      botChannelId: { type: String, trim: true },
      presenceChannelId: { type: String, trim: true },
    },
    youtube: {
      channels: { type: [{ type: String, required: true, trim: true }], default: [] },
      lastVideos: { type: [{ type: String, required: true, trim: true }], default: [] },
      notifyChannelId: { type: String, trim: true },
      alertRoleId: { type: String, trim: true },
    },
    tournament: {
      roleId: { type: String, trim: true },
      roleName: { type: String, trim: true },
      isActive: { type: Boolean, default: false },
    },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const schemaName =
  cfg.clientID === '986945043849945088'
    ? `[${cfg.mongodb}]ServerProfile:${cfg.clientID}`
    : `ServerProfile[${cfg.mongodb}]:${cfg.clientID}`;

module.exports = mongoose.model('ServerProfile', ServerProfileSchema, schemaName);
