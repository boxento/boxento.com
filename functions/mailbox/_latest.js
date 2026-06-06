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

  const assets = release.assets || [];
  const macDmg = assets.find((asset) => /^Mailbox-.+-mac-arm64\.dmg$/.test(asset.name || ''));
  const windowsInstaller = assets.find((asset) => /^Mailbox-.+-win-x64\.exe$/.test(asset.name || ''));

  if (!macDmg?.browser_download_url && !windowsInstaller?.browser_download_url) {
    throw new Error(`No Mailbox desktop download asset found for ${release.tag_name}.`);
  }

  return { release, macDmg, windowsInstaller };
}

export function getMailboxDownloadAsset({ macDmg, windowsInstaller }, request) {
  const url = new URL(request.url);
  const requestedPlatform = `${url.searchParams.get('platform') || url.searchParams.get('os') || ''}`.toLowerCase();
  const userAgent = request.headers.get('User-Agent') || '';
  const wantsWindows = /^(win|windows|win32|win64)$/i.test(requestedPlatform)
    || (!requestedPlatform && /\bWindows\b/i.test(userAgent));

  if (wantsWindows) {
    if (!windowsInstaller?.browser_download_url) {
      throw new Error('No Windows installer found for the latest Mailbox alpha release.');
    }
    return windowsInstaller;
  }

  if (!macDmg?.browser_download_url) {
    throw new Error('No Apple Silicon DMG found for the latest Mailbox alpha release.');
  }
  return macDmg;
}

export function redirectTo(url) {
  return Response.redirect(url, 302);
}
