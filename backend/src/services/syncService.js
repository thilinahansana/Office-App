const FormSubmission = require('../models/FormSubmission');
const FormSyncMeta = require('../models/FormSyncMeta');
const { runSheetSync } = require('./sheetSyncRunner');

async function runSync() {
  return runSheetSync({
    logLabel: 'form-sync',
    sheetId: process.env.GOOGLE_SHEET_ID,
    range: process.env.GOOGLE_SHEET_RANGE || 'Form Responses 1!A:F',
    SubmissionModel: FormSubmission,
    MetaModel: FormSyncMeta,
    metaId: 'form-sync-meta'
  });
}

module.exports = { runSync };
