const { google } = require('googleapis');
const path = require('path');

/**
 * Reads rows from a Google Sheet (shared by all sync sources — Form Data and
 * Entrepreneur Submissions each pass their own sheetId/range).
 *
 * Design tradeoff: there's no public URL on this LAN-only deployment to
 * receive a Google Forms/Apps Script webhook, so we POLL each Sheet on a
 * schedule (see jobs/syncCron.js) instead of receiving pushed events.
 * A single read-only service account (shared across sheets) keeps the
 * credential blast radius small.
 *
 * Returns { headers, rows } — row 1 of the sheet is treated as the column
 * names, and every row below it is mapped to those names dynamically. The
 * app never needs to know a form's fields ahead of time.
 */
async function fetchSheetRows({ sheetId, range }) {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;

  if (!keyPath || !sheetId || !range) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_KEY_PATH, a sheet ID, and a range must all be set to sync a Google Sheet'
    );
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(keyPath),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range
  });

  const rows = response.data.values || [];
  if (rows.length === 0) {
    return { headers: [], rows: [] };
  }

  const [header, ...dataRows] = rows;

  const mapped = dataRows.map((row, index) => {
    const sourceRowNumber = index + 2; // +1 for header, +1 for 1-based sheet rows
    const record = {};
    header.forEach((colName, colIndex) => {
      record[colName] = row[colIndex] ?? '';
    });
    return { sourceRowNumber, record };
  });

  return { headers: header, rows: mapped };
}

module.exports = { fetchSheetRows };
