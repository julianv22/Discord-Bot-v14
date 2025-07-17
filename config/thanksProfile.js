const ThanksProfileSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: true, trim: true },
    guildName: { type: String, trim: true },
    userId: { type: String, required: true, unique: true, index: true, trim: true },
    userName: { type: String, trim: true },
    thanksCount: { type: Number, default: 0, min: 0 },
    lastThanks: { type: Date, default: null },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const schemaName =
  cfg.clientID === '986945043849945088'
    ? `[${cfg.mongodb}]ThanksProfile:${cfg.clientID}`
    : `Thanks[${cfg.mongodb}]:${cfg.clientID}`;

module.exports = mongoose.model('ThanksProfile', ThanksProfileSchema, schemaName);
