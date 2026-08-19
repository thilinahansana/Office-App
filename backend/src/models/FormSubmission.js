const mongoose = require('mongoose');

// Fully dynamic: whatever columns exist in row 1 (the header row) of the
// linked Google Sheet become the keys of `fields` for every row below it.
// The app never needs to know the form's fields ahead of time — see
// services/syncService.js and models/FormSyncMeta.js (which tracks the
// current header list so the frontend can render table columns/filters).
const formSubmissionSchema = new mongoose.Schema({
  fields: { type: mongoose.Schema.Types.Mixed, default: {} },

  // Dedup keys: the Sheet row number is the most reliable identifier since
  // Google Forms timestamps can theoretically collide.
  sourceRowNumber: { type: Number, required: true, unique: true, index: true },
  submittedAt: { type: Date, index: true },
  syncedAt: { type: Date, default: Date.now }
});

formSubmissionSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);
