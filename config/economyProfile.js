const InventoryItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const EconomyProfileSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: true, trim: true },
    guildName: { type: String, trim: true },
    userId: { type: String, required: true, index: true, trim: true },
    userName: { type: String, trim: true },
    balance: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    inventory: { type: [InventoryItemSchema], default: [] }, // Sử dụng sub-schema đã định nghĩa
    achievements: { type: Object, default: {} },
    dailyCooldown: { type: Date, default: null },
    lastWork: { type: String, trim: true },
    lastRob: { type: Date, default: null },
    lastJob: { type: Date, default: null },
    totalEarned: { type: Number, default: 0, min: 0 },
    totalSpent: { type: Number, default: 0, min: 0 },
    streak: { type: Number, default: 0, min: 0 },
    maxStreak: { type: Number, default: 0, min: 0 },
    lastDaily: { type: Date, default: null },
    lastPlayRPS: { type: Date, default: null },
    rpsCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const schemaName =
  cfg.clientID === '986945043849945088'
    ? `[${cfg.mongodb}]Economy:${cfg.clientID}`
    : `Economy[${cfg.mongodb}]:${cfg.clientID}`;

module.exports = mongoose.model('EconomyProfile', EconomyProfileSchema, schemaName);
