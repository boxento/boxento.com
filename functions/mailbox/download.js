import { getLatestMailboxAlpha, redirectTo } from './_latest.js';

export async function onRequest() {
  try {
    const { dmg } = await getLatestMailboxAlpha();
    return redirectTo(dmg.browser_download_url);
  } catch (error) {
    return new Response(error.message || 'Unable to find the latest Mailbox alpha download.', {
      status: 502,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
