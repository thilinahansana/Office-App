const cron = require('node-cron');
const { runSync: runFormSync } = require('../services/syncService');
const { runSync: runEntrepreneurSync } = require('../services/entrepreneurSyncService');

/**
 * Polling instead of push: this app has no public URL for Google to send a
 * webhook to, so we pull each linked Sheet on a schedule. Default is every
 * 5 minutes — adjust via SYNC_CRON_SCHEDULE if the forms are low/high traffic.
 * Both sync sources (Form Data, Entrepreneur Submissions) share one schedule;
 * either can also be triggered on demand via its "Sync Now" button.
 */
function startSyncCron() {
  const schedule = process.env.SYNC_CRON_SCHEDULE || '*/5 * * * *';

  if (!cron.validate(schedule)) {
    console.error(`[sync] Invalid SYNC_CRON_SCHEDULE "${schedule}", cron job not started`);
    return;
  }

  cron.schedule(schedule, () => {
    runFormSync().catch((err) => console.error('[form-sync] Unexpected cron error:', err));
    runEntrepreneurSync().catch((err) => console.error('[entrepreneur-sync] Unexpected cron error:', err));
  });

  console.log(`[sync] Cron scheduled: ${schedule}`);
}

module.exports = startSyncCron;
