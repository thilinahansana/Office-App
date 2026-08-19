const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Google Drive share links (e.g. https://drive.google.com/file/d/FILE_ID/view)
// don't work directly as <img src>. This extracts the file ID so we can ask
// our own backend to fetch the thumbnail on our behalf (see driveThumbnailUrl).
export function extractDriveFileId(url) {
  if (!url) return null;
  const patterns = [/\/d\/([a-zA-Z0-9_-]{10,})/, /[?&]id=([a-zA-Z0-9_-]{10,})/];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Files shared before ~Sept 2021 (or via some "Share" flows) carry a
// `resourcekey` param in the share link. Without forwarding it, Drive
// rejects the thumbnail request even for a publicly-viewable file.
export function extractResourceKey(url) {
  if (!url) return null;
  const match = url.match(/[?&]resourcekey=([^&]+)/);
  return match ? match[1] : null;
}

export function isDriveFileLink(url) {
  return extractDriveFileId(url) !== null;
}

// Routes the request through our own backend (GET /api/drive-image) instead
// of loading drive.google.com/lh3.googleusercontent.com directly in the
// browser. Some ad-blockers/privacy extensions block embedded <img> requests
// to Google's CDN domains even though the same URL loads fine when visited
// directly — proxying through our own origin sidesteps that entirely, since
// the browser only ever talks to our own server.
export function driveThumbnailUrl(url, size = 400) {
  const id = extractDriveFileId(url);
  if (!id) return null;

  const params = new URLSearchParams({ id, size: String(size) });
  const resourceKey = extractResourceKey(url);
  if (resourceKey) {
    params.set('resourcekey', resourceKey);
  }

  return `${API_BASE_URL}/drive-image?${params.toString()}`;
}
