const EntrepreneurSubmission = require('../models/EntrepreneurSubmission');
const EntrepreneurSyncMeta = require('../models/EntrepreneurSyncMeta');
const { runSheetSync } = require('./sheetSyncRunner');

async function runSync() {
  return runSheetSync({
    logLabel: 'entrepreneur-sync',
    sheetId: process.env.GOOGLE_ENTREPRENEUR_SHEET_ID,
    range: process.env.GOOGLE_ENTREPRENEUR_SHEET_RANGE || 'Form Responses 1!A:F',
    SubmissionModel: EntrepreneurSubmission,
    MetaModel: EntrepreneurSyncMeta,
    metaId: 'entrepreneur-sync-meta'
  });
}

module.exports = { runSync };
