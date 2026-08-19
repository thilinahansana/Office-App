const MonthlyWork = require('../models/MonthlyWork');

// "YYYY-MM" -> the half-open date range covering that calendar month.
function monthRange(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  return { start, end };
}

async function list(req, res) {
  const { from, to, month, search } = req.query;
  const query = {};

  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }
  if (month) {
    const { start, end } = monthRange(month);
    query.date = { ...query.date, $gte: start, $lt: end };
  }
  if (search) {
    query.$or = [
      { workTitle: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { venue: { $regex: search, $options: 'i' } }
    ];
  }

  const items = await MonthlyWork.find(query).sort({ date: -1 }).lean();
  res.json(items);
}

// Distinct "YYYY-MM" values actually present in the data, for the Monthly
// Work page's month filter dropdown (only offers months with real records).
// Excludes records with no `date` (e.g. leftover rows from before this field
// existed) — $dateToString would otherwise group them under a null key.
async function listMonths(req, res) {
  const months = await MonthlyWork.aggregate([
    { $match: { date: { $ne: null } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$date' } } } },
    { $sort: { _id: -1 } }
  ]);
  res.json({ months: months.map((m) => m._id) });
}

async function create(req, res) {
  const { workTitle, description, venue, date, profitCount, images } = req.body;

  if (!workTitle || !description || !date) {
    return res.status(400).json({ error: 'workTitle, description, and date are required' });
  }

  const cleanImages = Array.isArray(images)
    ? images.map((url) => String(url).trim()).filter(Boolean)
    : [];

  const item = await MonthlyWork.create({
    workTitle,
    description,
    venue,
    date: new Date(date),
    profitCount,
    images: cleanImages,
    createdBy: req.user?.name || req.user?.username
  });

  res.status(201).json(item);
}

async function update(req, res) {
  const { workTitle, description, venue, date, profitCount, images } = req.body;

  if (!workTitle || !description || !date) {
    return res.status(400).json({ error: 'workTitle, description, and date are required' });
  }

  const cleanImages = Array.isArray(images)
    ? images.map((url) => String(url).trim()).filter(Boolean)
    : [];

  const item = await MonthlyWork.findByIdAndUpdate(
    req.params.id,
    { workTitle, description, venue, date: new Date(date), profitCount, images: cleanImages },
    { new: true, runValidators: true }
  );

  if (!item) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(item);
}

async function remove(req, res) {
  const item = await MonthlyWork.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(204).end();
}

module.exports = { list, listMonths, create, update, remove };
