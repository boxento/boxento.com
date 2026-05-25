import { getLatestMailboxAlpha, redirectTo } from './_latest.js';

export async function onRequest() {
  try {
    const { release } = await getLatestMailboxAlpha();
    return redirectTo(release.html_url);
  } catch (error) {
    return new Response(error.message || 'Unable to find the latest Mailbox alpha release.', {
      status: 502,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
