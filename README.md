<!-- coderabbit-ai-generated:v1 -->

# WDB – Website Development for Business

A service catalogue, client showcase, quote cart, enquiry and appointment website. The Next.js frontend renders the public content on the server. The Express API stores leads, quotes and appointments in MongoDB. The Quote Cart is an estimate; there is no online payment.

The original repository's extension remains in [`swarm-rebuild/`](swarm-rebuild/) with its [original documentation](SWARM-EXTENSION.md). The WDB site's cursor animation is a separate implementation.

## Run locally

Use Node.js 22 or newer. Install the same dependency versions locally and on your hosts with `npm ci`.

```sh
cp .env.example .env
npm ci
```

1. For persistent local data, put your MongoDB connection string in `.env` as `MONGODB_URI`. For a disposable demo, leave the sample `WDB_LOCAL_DB=1` setting. The first disposable run downloads MongoDB 8.0.17. On Ubuntu 26.04, set `MONGOMS_DISTRO=ubuntu-24.04` to use the supported binary.
2. To try `/admin`, generate a random `JWT_SECRET` with `openssl rand -hex 32`. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` (at least 12 characters) before starting the API. Startup creates the initial user if absent; it never overwrites an existing password. Remove the bootstrap password from the environment after provisioning a persistent database.
3. Run `npm run api` and `npm run dev` in separate terminals. Open `http://localhost:3000`. The frontend proxies `/api/*` to the backend. `GET /api/health` reports database readiness. When SMTP is omitted, the API saves requests but sends no email.

Run `npm test` for integration tests against a disposable MongoDB instance and a local SMTP listener. Run `npm run build` and `npm start -- --hostname 0.0.0.0` to serve the production build locally.

## Edit content and assets

| To edit | File |
| --- | --- |
| Prices, billing, package CTAs, features and add-ons | `data/packages.js` |
| Service categories, technology, process and benefits | `data/services.js` |
| Client cases and pending confirmations | `data/projects.js` |
| Package FAQs | `data/faqs.js` |
| Founder profile | `data/founder.js` |
| Brand, contact, navigation translations, budgets, appointment slots and closures | `data/site.js` |

The appointment horizon uses India Standard Time. Add recurring closures as weekday numbers (Sunday is 0) in `closedWeekdays`, or one-off dates as `YYYY-MM-DD` in `closedDates`. The locale toggle covers navigation; translate the remaining content in `data/` when Hindi copy is ready.

### Refresh real client captures

```sh
npx playwright install --with-deps chromium
npm run screenshots
```

The script captures the public home page at 1440×900 and 390×844, plus a full desktop page. Optimized WebPs go in `public/clients/`; the script writes the corresponding paths and framing capabilities to `data/project-screenshots.json`. A failed capture reports the affected site, exits with a nonzero status for automation and enables the branded fallback for that viewport. Set `SCREENSHOT_FRAME_ORIGIN` to the site's final frontend origin when checking frame policies that name allowed origins. The pipeline doesn't sign in to client sites.

## Deploy

1. **API on Render, AWS or Azure:** deploy this repository with Node.js 22+; install via `npm ci --omit=dev` and start via `npm run api`. Set `NODE_ENV=production`, a persistent `MONGODB_URI`, a strong `JWT_SECRET`, initial admin credentials and SMTP settings as backend secrets. Set `CORS_ORIGINS` to the exact HTTPS frontend origin(s), with no trailing slash, and use `/api/health` as the health check. Allow the service's outbound IPs on the MongoDB provider. The API creates the uniqueness indexes before accepting traffic; if importing existing records, resolve any duplicate active dates/slots first.
2. **Frontend on Vercel:** import the repository root as a Next.js project. Set `API_ORIGIN` to the HTTPS origin of the deployed Express API and `NEXT_PUBLIC_SITE_URL` to the canonical frontend origin. Add Maps and Analytics variables before building. The same-origin proxy keeps the HTTP-only admin session cookie scoped to the frontend.
3. **After deployment:** check `/api/health` from the frontend, verify admin login over HTTPS, then submit a real test enquiry and booking and confirm both SMTP recipients. Only configure `TRUST_PROXY_HOPS` if the host guarantees that trusted proxies replace incoming forwarding headers. The bundled rate limiter is per instance; for a multi-instance deployment, enforce shared rate limits at the gateway or configure a shared limiter store. Monitor email delivery and back up the production database.

## Owner checklist

- [ ] Replace the founder photo at `public/umar.jpg` and resume at `public/Umar_Resume.pdf`.
- [ ] Confirm the remaining project stacks and add owner-approved testimonials in `data/projects.js`.
- [ ] Confirm how DAN ERP Iraqi invoicing applies, its Arabic/RTL readiness, and add approved, redacted dashboard screenshots. The current DAN capture is the public sign-in page.
- [ ] Confirm the custom scope, if any, for Influencer Collaboration* in `data/projects.js`.
- [ ] Confirm the Lulu Galaxy and Faiz Interiors canonical domains; their respective deployment links are currently used.
- [ ] Add the Google Maps **Embed a map** URL as `NEXT_PUBLIC_MAPS_EMBED_URL`. The directions button and QR work without it.
- [ ] Set `NEXT_PUBLIC_GA_ID`, SMTP credentials and notification addresses; then test production delivery.
