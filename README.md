# Vital AI — Mobile App

A production-grade **Expo / React Native / TypeScript** mobile app scaffold for the Vital AI
health & wellness platform. Original design system — no Google Health branding, icons, or
assets used anywhere.

## What's included

- **Auth**: Splash, onboarding, login, signup, OTP login/verification, forgot password,
  social login stubs (Google / Apple / Microsoft — wire up real SDKs when you're ready).
- **Dashboard**: vitals summary, quick actions, AI daily suggestions.
- **AI Assistant**: chat UI wired to a backend AI gateway (`/ai/*`) — the app never calls
  OpenAI/Claude/Gemini directly or holds provider keys, so no keys leak client-side.
- **Health**: health profile, vitals tracker (heart rate, BP, sugar, steps, sleep, water),
  medication reminders, mood journal.
- **Appointments**: doctor search, booking flow, appointment list.
- **Emergency SOS**: full-screen alert flow that shares live location.
- **Profile**: account menu, dark/light mode, notification & privacy toggles.
- **About** (new): a Founder section (photo, name, bio, Instagram/LinkedIn/Twitter) and a
  Team section below it — **both fully driven from the backend CMS**, nothing hardcoded.
  Admins manage founder details and add/edit/reorder team members (position, name, photo,
  social links) from the Admin Panel; the app just renders whatever's published.
- **No payment code anywhere** — `APP_CONFIG.featureFlags.payments/subscriptions` are `false`
  by design, and there is no Stripe/Razorpay/billing code in this scaffold.

## Architecture

```
src/
  theme/         design tokens, light/dark color system, ThemeContext
  navigation/     Root -> Auth stack | Main tabs (Home, Health, AI Chat, Appointments, Profile)
  screens/        one folder per feature area
  components/     Button, Card, TextField, StatCard, SocialLinks — all theme-aware
  services/       typed API clients (axios) — one file per domain, talking to your NestJS backend
  store/          zustand auth store (session hydration, login/signup/OTP/logout)
  types/          shared domain types (User, HealthProfile, VitalReading, TeamMember, ...)
  constants/      app config, route names, feature flags
```

Every screen fetches through `services/*` using React Query — no mock data baked into
components. Point `EXPO_PUBLIC_API_BASE_URL` at your NestJS + PostgreSQL + Prisma backend and
everything becomes live.

## Backend contract for the About/Team section

```
GET /cms/about/founder   -> { name, role, bio, photoUrl, instagramUrl?, linkedinUrl?, twitterUrl? }
GET /cms/about/team      -> [{ id, name, position, photoUrl, instagramUrl?, linkedinUrl?, twitterUrl?, order }]
```

Build the matching Admin Panel screens (CMS → About → Founder, CMS → About → Team) as simple
CRUD forms over these two resources — image upload can reuse your existing Media Library /
S3 pipeline.

## Running it

```bash
npm install
npx expo start
```

Requires a physical device/simulator with Expo Go, or `expo run:ios` / `expo run:android`
for a dev build. This container has no network access, so dependencies aren't installed here
— run `npm install` on your machine.

## Honest scope note

The original brief asked for the *entire* ecosystem — web app, PWA, admin panel, doctor
panel, full NestJS + Prisma backend, AI gateway, CMS/page-builder, DevOps, and more. That's a
multi-month, multi-repo build for a real engineering team, not something any single response
can responsibly hand you as "production ready." This scaffold is a genuine, working
foundation for the **mobile app** specifically: real navigation, real typed API layer, real
theming, real screens for every core user feature listed in the brief (health tracking, AI
chat, appointments, emergency SOS, profile/settings, and now About/Team).

Natural next steps, in order of what unlocks the most:
1. The NestJS + Prisma backend (auth, health data, appointments, AI gateway, CMS endpoints).
2. The Admin Panel (Next.js) — starting with the CMS forms for Founder/Team, then the rest.
3. The Doctor Panel.
4. The marketing website + PWA.

Happy to build any one of these out next in the same depth as this mobile app.
