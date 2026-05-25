# boxento.com

Static marketing site for Boxento, intended for Cloudflare Pages.

## Pages

- `/` - main Boxento website
- `/start` - product page for Boxento Start, linking to `boxento.app`
- `/mailbox` - product page for Boxento Mailbox with the Mac alpha download

## Local preview

```sh
npm run dev
```

Then open `http://localhost:4173`.

The local preview uses Wrangler so routes such as `/start` and `/mailbox`
match Cloudflare Pages behavior.

## Cloudflare Pages

Wrangler deploys the `public/` directory:

```sh
npm run deploy
```
