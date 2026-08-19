const mongoose = require('mongoose');

const monthlyWorkSchema = new mongoose.Schema({
  workTitle: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  venue: { type: String, trim: true },
  date: { type: Date, required: true, index: true },
  profitCount: { type: Number },
  // Images are uploaded to Google Drive out-of-band; we only store the share links here.
  images: { type: [String], default: [] },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('MonthlyWork', monthlyWorkSchema);
