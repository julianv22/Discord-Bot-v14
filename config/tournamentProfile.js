const TournamentProfileSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: true, trim: true },
    guildName: { type: String, trim: true },
    userId: { type: String, required: true, unique: true, index: true, trim: true },
    userName: { type: String, trim: true },
    inGameName: { type: String, trim: true },
    deckList: { type: String, trim: true, default: null },
    registrationStatus: { type: Boolean, default: false },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const schemaName =
  cfg.clientID === '986945043849945088'
    ? `[${cfg.mongodb}]Tournament:${cfg.clientID}`
    : `Tournament[${cfg.mongodb}]:${cfg.clientID}`;

module.exports = mongoose.model('TournamentProfile', TournamentProfileSchema, schemaName);
