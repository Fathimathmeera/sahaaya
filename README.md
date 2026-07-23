# Sahaya

Sahaya is a Next.js 15 accessibility companion for wheelchair users. It combines Firebase, OpenStreetMap/Leaflet, GraphHopper, OpenAI, Twilio, and Google Places through secure server-side integrations.

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local`.
3. Fill in the variables required for the features you plan to use.
4. Run `pnpm dev`.

Do not commit `.env.local` or any real credentials.

## Environment variables

| Variable | Required for | Client-visible |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Authentication, Firestore, Storage | Yes |
| `OPENAI_API_KEY` | AI assistant and accessibility scanner | No |
| `OPENAI_TEXT_MODEL`, `OPENAI_VISION_MODEL`, `OPENAI_IMAGE_MODEL` | Optional model overrides | No |
| `GRAPHHOPPER_API_KEY` | Accessible route planner | No |
| `GRAPHHOPPER_WHEELCHAIR_PROFILE` | Optional custom wheelchair routing profile | No |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | Emergency SMS | No |
| `GOOGLE_MAPS_API_KEY` | Nearby hospital search | No |

Only Firebase web configuration carries the `NEXT_PUBLIC_` prefix. All service keys are read exclusively in server route handlers.

## Deploy to Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the repository in Vercel; the included `vercel.json` uses `pnpm install --frozen-lockfile` and `pnpm build`.
3. Add the variables from `.env.example` under **Project Settings â†’ Environment Variables**. Use Production, Preview, and Development values as appropriate.
4. Redeploy after changing any environment variable.
5. In Firebase, add the Vercel production domain to Authentication authorized domains, deploy [Firestore rules](./firestore.rules), and deploy [Storage rules](./storage.rules).
6. Enable the Google Places API (New) for the Google key, configure a GraphHopper wheelchair/custom profile, and use a verified Twilio sender.

## Production checklist

- Run `pnpm build` and verify core user flows against real credentials.
- Restrict API keys by API, domain, and server IP where each provider supports it.
- Configure Firebase Auth providers and security rules before enabling user data.
- Test OpenAI, GraphHopper, Twilio, and Google Places failure states as well as successful calls.
- Verify SOS messaging consent and local emergency-service numbers for each deployment region.
- Run Lighthouse and keyboard/screen-reader tests on the production deployment.

The project adds standard security headers, production error/404 pages, React Strict Mode, compression, and pnpm build approvals for Next.js image optimization. See the [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist) and [Vercel environment variables guide](https://vercel.com/docs/environment-variables).

## OpenAI features and cost controls

Sahaya sends OpenAI requests only from server route handlers. `OPENAI_API_KEY` must remain in `.env.local` locally and in Vercel server environment variables; never prefix it with `NEXT_PUBLIC_`.

| Feature | Endpoint | What is sent | Response used by the app | Typical usage |
| --- | --- | --- | --- | --- |
| Accessibility assistant | `POST /api/assistant` | Last 12 short chat turns | English or Malayalam accessibility guidance | One request after the user sends a message |
| Building scanner | `POST /api/accessibility-scan` | One user-selected image (max 8 MB) | Visible-feature report, score, limits, improvements | One request after Analyze is pressed |
| Community report helper | `POST /api/community-report` | Place, rating, status, and comment | Clear rewritten report and category | One request immediately before saving a report; falls back to original text |
| Indoor guidance | `POST /api/indoor-guidance` | Selected destination and displayed indoor landmarks | Three to five spoken instructions | One request when navigation starts; local fallback is available |
| Emergency guidance | `POST /api/emergency-guidance` | User-entered situation and known route context | Calm guidance and a prepared contact message | One request when requested; it never sends an SMS itself |

All endpoints use the Responses API and structured JSON where the UI needs reliable fields. Default `gpt-5-mini` settings keep each normal text call small: roughly 200–1,200 input tokens and 80–350 output tokens. Vision cost depends on image size/detail, so the scanner accepts one image only and is invoked manually. Map rendering, GraphHopper routing, Firebase, location lookup, storage, authentication, and SMS delivery do not call OpenAI.

The browser Web Speech API provides voice capture and read-aloud without sending audio to OpenAI. For production, test Malayalam voices in the target browser/device. Adjust model IDs in `OPENAI_TEXT_MODEL` and `OPENAI_VISION_MODEL`, endpoint instructions, or the scanner image `detail` setting in the corresponding server routes when balancing quality and cost.
