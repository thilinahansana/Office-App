const { runSync } = require('../services/syncService');

async function run(req, res) {
  const result = await runSync();
  if (result.errors.length > 0) {
    return res.status(502).json(result);
  }
  res.json(result);
}

module.exports = { run };
