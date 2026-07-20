# Sahaya

Sahaya is an accessible Next.js application for wheelchair users. It includes Firebase email/password and Google authentication, protected dashboard routes, a Firestore and Storage-backed community-report form, and mock-only navigation/scanner results until external services are configured.

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Create a Firebase project and register a Web app in the Firebase console.
3. Add the Firebase Web app values to `.env.local`.
4. Enable **Email/Password** and **Google** providers in Firebase Authentication.
5. Create Firestore and Firebase Storage, then configure their security rules for authenticated users.
6. Install dependencies with `pnpm install` and start with `pnpm dev`.

Google Maps is intentionally not called until a real Google Maps API key and a routing implementation are added. Navigation, nearby-place, hospital, and scanner analysis results are clearly marked as sample/mock data.

## Firebase configuration

The application does not embed credentials. Add these browser-safe Firebase web configuration values to `.env.local`:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```
