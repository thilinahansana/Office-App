const mongoose = require('mongoose');

// Singleton document tracking the most recent header row seen from the
// Google Sheet linked to the entrepreneur registration form.
const entrepreneurSyncMetaSchema = new mongoose.Schema({
  _id: { type: String, default: 'entrepreneur-sync-meta' },
  columns: { type: [String], default: [] },
  lastSyncedAt: { type: Date }
});

module.exports = mongoose.model('EntrepreneurSyncMeta', entrepreneurSyncMetaSchema);
