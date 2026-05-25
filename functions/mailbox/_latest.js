const RELEASES_API_URL = 'https://api.github.com/repos/boxento/mailbox-releases/releases?per_page=30';

function compareReleaseDate(a, b) {
  return new Date(b.published_at || b.created_at || 0).getTime() - new Date(a.published_at || a.created_at || 0).getTime();
}

export async function getLatestMailboxAlpha() {
  const response = await fetch(RELEASES_API_URL, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'boxento-com',
    },
    cf: {
      cacheEverything: true,
      cacheTtl: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub releases request failed with ${response.status}`);
  }

  const releases = await response.json();
  const release = releases
    .filter((item) => item && !item.draft && item.prerelease && /^v\d+\.\d+\.\d+-alpha\.\d+$/.test(item.tag_name || ''))
    .sort(compareReleaseDate)[0];

  if (!release) {
    throw new Error('No Mailbox alpha release found.');
  }

  const dmg = (release.assets || []).find((asset) => /^Mailbox-.+-mac-arm64\.dmg$/.test(asset.name || ''));
  if (!dmg?.browser_download_url) {
    throw new Error(`No Apple Silicon DMG asset found for ${release.tag_name}.`);
  }

  return { release, dmg };
}

export function redirectTo(url) {
  return Response.redirect(url, 302);
}
