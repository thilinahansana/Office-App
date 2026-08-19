# Office Data Tracker

Internal bilingual (Sinhala / English) data tracking app for a local network. React PWA frontend, Node.js/Express backend, MongoDB Atlas database. No public hosting, no domain — runs on a machine on the office LAN and is accessed by other devices via that machine's LAN IP.

## Stack

- **Frontend**: React (Vite), `react-i18next`, `react-router-dom`, configured as a PWA
- **Backend**: Node.js + Express, JWT auth, `node-cron`, `googleapis`
- **Database**: MongoDB Atlas (cloud-hosted — not a Docker container)
- **Deployment**: Docker Compose, two containers (`frontend`, `backend`), no reverse proxy / domain

## Project Structure

```
/backend    Express API, Mongoose models, Google Sheets sync, seedUser script
/frontend   React app (Vite + PWA + i18next)
docker-compose.yml
```

## Prerequisites

- Node.js 20+ (only needed for local dev outside Docker, or running `seedUser.js`)
- Docker + Docker Compose
- A MongoDB Atlas cluster and connection string
- A Google Cloud service account with read-only Sheets access (for form sync)

## 1. MongoDB Atlas Setup

1. Create a free-tier (or larger) cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and note the username/password.
3. Under Network Access, allow the IP of the machine that will run the backend (or `0.0.0.0/0` for simplicity on a trusted internal deployment).
4. Copy the connection string — you'll put it in `backend/.env` as `MONGODB_URI`.

## 2. Google Sheets Sync Setup (Form → Sheet → MongoDB)

Google Forms can't push a webhook to this app because it has no public URL, so the backend **polls** each linked Google Sheet on a schedule instead (see `backend/src/jobs/syncCron.js`). There are **two independent sync sources**, sharing one service account but reading two separate Sheets into two separate collections:

- **Form Data page** — the general Google Form/Sheet, synced into `FormSubmission`.
- **Entrepreneur Details page** — a second Google Form/Sheet (e.g. an entrepreneur registration form), synced into `EntrepreneurSubmission`. This page is entirely sync-driven, same as Form Data — there is no manual add/edit/delete form.

1. In Google Cloud Console, create a project (or reuse one) and enable the **Google Sheets API**.
2. Create a **Service Account**, then generate a JSON key for it.
3. Open each Google Sheet that a Form's responses feed into, and share it with the service account's email address (`...@...iam.gserviceaccount.com`) as **Viewer**.
4. Save the downloaded JSON key file as `backend/secrets/google-service-account.json` (this path is gitignored and mounted into the container via `docker-compose.yml`; the same key is used for both sheets).
5. Set `GOOGLE_SHEET_ID` / `GOOGLE_SHEET_RANGE` (Form Data) and `GOOGLE_ENTREPRENEUR_SHEET_ID` / `GOOGLE_ENTREPRENEUR_SHEET_RANGE` (Entrepreneur Details) in `backend/.env` — see `.env.example`.

Column mapping is fully dynamic for both sources: row 1 of each Sheet (the header row) becomes the field names for every row below it, whatever they are. The backend stores each row's data as a `fields` object keyed by those exact header strings (see `backend/src/services/sheetSyncRunner.js`, shared by `syncService.js` and `entrepreneurSyncService.js`), and keeps a running record of each Sheet's current header list in a `*SyncMeta` singleton collection, updated on every sync. The frontend (`frontend/src/components/SheetSyncPanel.jsx` + `frontend/src/hooks/useSheetSync.js`, shared by both pages) reads that column list from the API and renders the table and the "filter by column" dropdown from it directly — no code changes needed when a form's fields change, just re-sync.

## 3. Backend Setup

```bash
cd backend
cp .env.example .env
# edit .env: MONGODB_URI, JWT_SECRET, GOOGLE_SHEET_ID, etc.
npm install
```

### Create a user (no public registration page)

There is no sign-up page — users are added directly via a script:

```bash
node scripts/seedUser.js --username admin --password "a-strong-password" --name "Admin User"
```

Or edit the `DEFAULT_USER` object at the top of `scripts/seedUser.js` and run it with no arguments. Run this once per user you need.

### Run locally (without Docker)

```bash
npm run dev
```

Backend listens on `http://0.0.0.0:4000` (binds all interfaces so LAN devices can reach it directly, useful even outside Docker).

## 4. Frontend Setup

```bash
cd frontend
cp .env.example .env
# edit .env: VITE_API_BASE_URL should point at the backend's LAN-reachable URL
npm install
npm run dev
```

Frontend runs on `http://0.0.0.0:3000`.

**Important**: `VITE_API_BASE_URL` is baked into the frontend build at build time (a Vite convention — nothing server-side reads it at runtime). Set it to your host machine's LAN IP (e.g. `http://192.168.1.20:4000/api`), not `localhost`, so the second device can actually reach the backend.

## 5. Running with Docker Compose (recommended for the office LAN)

1. Find your host machine's LAN IP (e.g. `ipconfig getifaddr en0` on macOS, `hostname -I` on Linux, or `ipconfig` on Windows).
2. Configure both `.env` files as above — set `frontend/.env`'s `VITE_API_BASE_URL` to `http://<host-lan-ip>:4000/api`.
3. Place the Google service account key at `backend/secrets/google-service-account.json`.
4. From the project root:

```bash
docker compose up --build
```

5. On the **host machine**, the app is at `http://localhost:3000`.
6. On a **second device on the same network**, browse to `http://<host-lan-ip>:3000`.
7. To create the first user, run the seed script from the host (it only needs `MONGODB_URI`, not Docker):

```bash
cd backend && node scripts/seedUser.js --username admin --password "a-strong-password" --name "Admin User"
```

If you change `frontend/.env` later, you must rebuild (`docker compose up --build`) since the value is compiled into the static bundle, not read at container start.

## PWA Notes

PWA install and offline caching require a secure context — HTTPS, or the special-cased `localhost`. Plain `http://<lan-ip>:3000` on a second device is **not** a secure context, so:

- The service worker may not register, and the "Install app" prompt may not appear on the second device.
- The app still works fine as a normal responsive web page in that case — this is a graceful degradation, not a broken state.
- To get full PWA behavior over LAN, set up a local certificate with [mkcert](https://github.com/FiloSottile/mkcert) and serve both containers over HTTPS. This isn't set up by default to keep the local deployment simple.

## API Routes

```
POST   /api/auth/login                   (public)
GET    /api/drive-image                  (public; proxies a Google Drive thumbnail — see PWA/Photos notes below)
GET    /api/form-submissions             (auth required; query: from, to, column, value, search)
POST   /api/form-sync/run                (auth required; triggers an on-demand sync)
GET    /api/entrepreneur-submissions     (auth required; query: from, to, column, value, search)
POST   /api/entrepreneur-sync/run        (auth required; triggers an on-demand sync)
GET    /api/monthly-work                 (auth required; query: from, to, month, search)
GET    /api/monthly-work/months          (auth required; distinct "YYYY-MM" values present in the data, for the month filter dropdown)
POST   /api/monthly-work                 (auth required)
PUT    /api/monthly-work/:id             (auth required)
DELETE /api/monthly-work/:id             (auth required)
```

All protected routes require `Authorization: Bearer <token>`.

`GET /api/form-submissions` and `GET /api/entrepreneur-submissions` both return `{ columns, rows }` — `columns` is that source's linked Sheet's current header row (see above), and each row in `rows` has a `fields` object keyed by those same column names.

## Data Models

- **User**: `username`, `passwordHash`, `name`, `createdAt`
- **FormSubmission**: `fields` (a dynamic object keyed by whatever columns exist in the linked Sheet — see above), `sourceRowNumber` (dedup key), `submittedAt`, `syncedAt`
- **FormSyncMeta**: singleton doc tracking the Form Data Sheet's current header/column list (`columns`, `lastSyncedAt`), refreshed on every sync
- **EntrepreneurSubmission** / **EntrepreneurSyncMeta**: same shape as `FormSubmission` / `FormSyncMeta` above, but for the Entrepreneur Details page's separate linked Sheet
- **MonthlyWork**: `workTitle`, `description`, `venue`, `date`, `profitCount`, `images` (array of Google Drive share links), `createdBy`, `createdAt`

## Design Tradeoffs Worth Revisiting

- **Polling vs. webhook** for form sync (`backend/src/jobs/syncCron.js`, `backend/src/services/googleSheetsService.js`): there's no public URL to receive a push from Google, so the Sheet is polled every 5 minutes by default (`SYNC_CRON_SCHEDULE`). If you later add a public tunnel (e.g. ngrok, Cloudflare Tunnel) or move to real hosting, a push-based Apps Script trigger would reduce latency and API calls.
- **PWA over LAN IP** (`frontend/vite.config.js`): install/offline features need HTTPS or `localhost`; see the PWA Notes section above.
- **Fully dynamic `FormSubmission` schema**: row 1 of the linked Sheet is treated as the column list and stored in `FormSyncMeta`; every row below it is stored as a `fields` object keyed by those headers, with no fixed schema. If the Sheet's headers change, older synced rows simply won't have the new/removed keys — the table renders whatever's present per row. See `backend/src/services/syncService.js`.
- **Drive image proxy** (`backend/src/controllers/driveImageController.js`, `frontend/src/utils/googleDrive.js`): Monthly Work photos are pasted as Google Drive share links (uploaded to Drive out-of-band, sharing set to "Anyone with the link"). Rather than the browser loading `drive.google.com`/`googleusercontent.com` thumbnails directly — which some ad-blockers and privacy extensions block for embedded `<img>` requests even though the same URL loads fine when visited directly — the backend proxies the request through its own origin. This route is intentionally not behind `requireAuth`, since a plain `<img src>` can't send an `Authorization` header, and it only ever forwards to Google's already-public thumbnail endpoint (the target host is hardcoded, so it can't be abused as an open proxy to arbitrary URLs).
