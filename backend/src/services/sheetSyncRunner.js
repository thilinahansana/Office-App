const { fetchSheetRows } = require('./googleSheetsService');

// Looks for a "Timestamp" column (Google Forms adds one automatically) to use
// as the submission date; every other column is stored verbatim in `fields`.
function mapRowToDoc({ sourceRowNumber, record }) {
  const timestampKey = Object.keys(record).find((key) => /timestamp/i.test(key));
  const submittedAt = timestampKey ? new Date(record[timestampKey]) : new Date();

  return {
    sourceRowNumber,
    submittedAt: isNaN(submittedAt.getTime()) ? new Date() : submittedAt,
    fields: record,
    syncedAt: new Date()
  };
}

/**
 * Shared by every Google Sheet -> MongoDB sync source (Form Data,
 * Entrepreneur Submissions, ...) — each source supplies its own sheet
 * location and models; the polling/dedup/logging logic is identical.
 */
async function runSheetSync({ logLabel, sheetId, range, SubmissionModel, MetaModel, metaId }) {
  const startedAt = new Date();
  const result = { checked: 0, inserted: 0, errors: [] };

  try {
    const { headers, rows } = await fetchSheetRows({ sheetId, range });
    result.checked = rows.length;

    if (headers.length > 0) {
      await MetaModel.findByIdAndUpdate(
        metaId,
        { columns: headers, lastSyncedAt: new Date() },
        { upsert: true }
      );
    }

    if (rows.length > 0) {
      // Dedup on sourceRowNumber: only rows not already present get inserted.
      const existingRowNumbers = new Set(
        (await SubmissionModel.find({}, { sourceRowNumber: 1 }).lean()).map((d) => d.sourceRowNumber)
      );

      const newRows = rows.filter((r) => !existingRowNumbers.has(r.sourceRowNumber));

      if (newRows.length > 0) {
        const docs = newRows.map(mapRowToDoc);
        const inserted = await SubmissionModel.insertMany(docs, { ordered: false });
        result.inserted = inserted.length;
      }
    }
  } catch (err) {
    result.errors.push(err.message);
  }

  const durationMs = Date.now() - startedAt.getTime();
  const log = { ...result, durationMs, ranAt: startedAt.toISOString() };
  if (result.errors.length > 0) {
    console.error(`[${logLabel}]`, log);
  } else {
    console.log(`[${logLabel}]`, log);
  }
  return log;
}

module.exports = { runSheetSync };
