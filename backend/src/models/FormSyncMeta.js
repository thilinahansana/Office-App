const mongoose = require('mongoose');

// Singleton document tracking the most recent header row seen from the
// linked Google Sheet, so the frontend can render table columns and the
// column filter dropdown even when older synced rows predate a header
// that was added later.
const formSyncMetaSchema = new mongoose.Schema({
  _id: { type: String, default: 'form-sync-meta' },
  columns: { type: [String], default: [] },
  lastSyncedAt: { type: Date }
});

module.exports = mongoose.model('FormSyncMeta', formSyncMetaSchema);
