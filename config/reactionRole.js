// Định nghĩa sub-schema cho các mục trong mảng roles
const ReactionRoleItemSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true, trim: true },
    roleId: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ReactionRoleSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: true, trim: true },
    guildName: { type: String, trim: true },
    channelId: { type: String, required: true, index: true, trim: true },
    messageId: { type: String, required: true, unique: true, index: true, trim: true },
    roles: {
      type: [ReactionRoleItemSchema], // Sử dụng sub-schema đã định nghĩa
      default: [],
    },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const schemaName =
  cfg.clientID === '986945043849945088'
    ? `[${cfg.mongodb}]ReactionRole:${cfg.clientID}`
    : `ReactionRole[${cfg.mongodb}]:${cfg.clientID}`;

module.exports = mongoose.model('ReactionRole', ReactionRoleSchema, schemaName);
