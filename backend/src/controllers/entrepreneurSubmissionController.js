const EntrepreneurSubmission = require('../models/EntrepreneurSubmission');
const EntrepreneurSyncMeta = require('../models/EntrepreneurSyncMeta');

async function list(req, res) {
  const { from, to, column, value, search } = req.query;
  const match = {};

  if (from || to) {
    match.submittedAt = {};
    if (from) match.submittedAt.$gte = new Date(from);
    if (to) match.submittedAt.$lte = new Date(to);
  }

  if (column && value) {
    match[`fields.${column}`] = { $regex: value, $options: 'i' };
  }

  const pipeline = [{ $match: match }];

  if (search) {
    pipeline.push(
      { $addFields: { __fieldsArray: { $objectToArray: '$fields' } } },
      { $match: { '__fieldsArray.v': { $regex: search, $options: 'i' } } },
      { $project: { __fieldsArray: 0 } }
    );
  }

  pipeline.push({ $sort: { submittedAt: -1 } });

  const [rows, meta] = await Promise.all([
    EntrepreneurSubmission.aggregate(pipeline),
    EntrepreneurSyncMeta.findById('entrepreneur-sync-meta').lean()
  ]);

  res.json({ columns: meta?.columns || [], rows });
}

module.exports = { list };
