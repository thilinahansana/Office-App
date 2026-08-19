const express = require('express');
const cors = require('cors');

const requireAuth = require('./middleware/requireAuth');
const authRoutes = require('./routes/auth');
const formSubmissionRoutes = require('./routes/formSubmissions');
const formSyncRoutes = require('./routes/formSync');
const monthlyWorkRoutes = require('./routes/monthlyWork');
const entrepreneurSubmissionRoutes = require('./routes/entrepreneurSubmissions');
const entrepreneurSyncRoutes = require('./routes/entrepreneurSync');
const driveImageRoutes = require('./routes/driveImage');

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(cors({ origin: corsOrigins }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/drive-image', driveImageRoutes);

// Everything below requires a valid JWT.
app.use('/api/form-submissions', requireAuth, formSubmissionRoutes);
app.use('/api/form-sync', requireAuth, formSyncRoutes);
app.use('/api/monthly-work', requireAuth, monthlyWorkRoutes);
app.use('/api/entrepreneur-submissions', requireAuth, entrepreneurSubmissionRoutes);
app.use('/api/entrepreneur-sync', requireAuth, entrepreneurSyncRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Centralized error handler so route handlers can stay free of try/catch boilerplate.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
