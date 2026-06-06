import { getLatestMailboxAlpha, getMailboxDownloadAsset, redirectTo } from './_latest.js';

export async function onRequest({ request }) {
  try {
    const latest = await getLatestMailboxAlpha();
    const asset = getMailboxDownloadAsset(latest, request);
    return redirectTo(asset.browser_download_url);
  } catch (error) {
    return new Response(error.message || 'Unable to find the latest Mailbox alpha download.', {
      status: 502,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
