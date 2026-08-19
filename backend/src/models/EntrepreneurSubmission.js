const mongoose = require('mongoose');

// Same shape/pattern as FormSubmission — kept as a separate model/collection
// (rather than sharing one) because sourceRowNumber is only unique within a
// single sheet; two independent sheets would otherwise collide on row 2, 3, ...
const entrepreneurSubmissionSchema = new mongoose.Schema({
  fields: { type: mongoose.Schema.Types.Mixed, default: {} },
  sourceRowNumber: { type: Number, required: true, unique: true, index: true },
  submittedAt: { type: Date, index: true },
  syncedAt: { type: Date, default: Date.now }
});

entrepreneurSubmissionSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('EntrepreneurSubmission', entrepreneurSubmissionSchema);
