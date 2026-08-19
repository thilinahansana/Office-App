// Proxies Google Drive thumbnail requests through our own server instead of
// having the browser fetch drive.google.com/lh3.googleusercontent.com directly.
// Some browsers/ad-blockers/privacy extensions block third-party embedded
// requests to Google's CDN domains even though the same URL loads fine when
// visited directly — routing through our own origin sidesteps that entirely.
//
// Only ever proxies to drive.google.com (host is hardcoded below; `id`,
// `size`, `resourcekey` are just appended as query values), so this can't be
// abused as an open proxy to arbitrary URLs.
async function getThumbnail(req, res) {
  const { id, size = '400', resourcekey } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  const target = new URL('https://drive.google.com/thumbnail');
  target.searchParams.set('id', id);
  target.searchParams.set('sz', `w${size}`);
  if (resourcekey) {
    target.searchParams.set('resourcekey', resourcekey);
  }

  const driveResponse = await fetch(target, { redirect: 'follow' });

  if (!driveResponse.ok) {
    return res.status(502).json({ error: 'Failed to fetch image from Google Drive' });
  }

  const contentType = driveResponse.headers.get('content-type') || 'image/jpeg';
  const buffer = Buffer.from(await driveResponse.arrayBuffer());

  res.set('Content-Type', contentType);
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(buffer);
}

module.exports = { getThumbnail };
