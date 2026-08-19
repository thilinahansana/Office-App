require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const startSyncCron = require('./jobs/syncCron');

const PORT = process.env.PORT || 4000;

async function main() {
  await connectDB();
  startSyncCron();

  // Bind 0.0.0.0 (not just localhost) so the second device on the LAN can reach this.
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server] Listening on 0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
