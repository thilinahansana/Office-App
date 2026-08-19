const FormSubmission = require('../models/FormSubmission');
const FormSyncMeta = require('../models/FormSyncMeta');

async function list(req, res) {
  const { from, to, column, value, search } = req.query;
  const match = {};

  if (from || to) {
    match.submittedAt = {};
    if (from) match.submittedAt.$gte = new Date(from);
    if (to) match.submittedAt.$lte = new Date(to);
  }

  // Filter by a single dynamic column (picked from the current sheet's
  // header list on the frontend) — safe as a Mixed sub-field path since it's
  // never interpreted as a query operator.
  if (column && value) {
    match[`fields.${column}`] = { $regex: value, $options: 'i' };
  }

  const pipeline = [{ $match: match }];

  // Free-text search across every column, regardless of its name.
  if (search) {
    pipeline.push(
      { $addFields: { __fieldsArray: { $objectToArray: '$fields' } } },
      { $match: { '__fieldsArray.v': { $regex: search, $options: 'i' } } },
      { $project: { __fieldsArray: 0 } }
    );
  }

  pipeline.push({ $sort: { submittedAt: -1 } });

  const [rows, meta] = await Promise.all([
    FormSubmission.aggregate(pipeline),
    FormSyncMeta.findById('form-sync-meta').lean()
  ]);

  res.json({ columns: meta?.columns || [], rows });
}

module.exports = { list };
