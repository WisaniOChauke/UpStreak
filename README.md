# UpStreak

> Turn daily intentions into lasting progress.

UpStreak helps you build habits, make progress on goals, and reflect through journaling in one calm, focused workspace.

---

## ✨ Features

- **Today** — Check off daily habits, filter by category, drag to reorder
- **Goals** — Set and monitor short and long-term goals with milestones
- **Journal** — Write daily reflections, browse and search past entries
- **Stats** — Weekly bar chart, activity heatmap, mood trend line chart
- **Weekly Review** — Full breakdown of your week's performance
- **Achievements** — Earn badges as you build consistency
- **Profile** — Edit name, avatar, theme, export data, reset progress
- **Themes** — Default, Forest, Ocean, Minimal (light + dark)
- **Reminders** — Browser notifications at your chosen time
- **Confetti** — Celebrate perfect days 🎉

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 3](https://nuxt.com/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + CSS Custom Properties |
| State Management | [Pinia](https://pinia.vuejs.org/) + [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/) |
| Backend client | [Supabase](https://supabase.com/) |
| Charts | [Chart.js](https://www.chartjs.org/) + [vue-chartjs](https://vue-chartjs.org/) |
| Utilities | [VueUse](https://vueuse.org/) |
| Animations | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

App runs at `http://localhost:3000`

### Supabase configuration

Copy `.env.example` to `.env` and set `NUXT_PUBLIC_SUPABASE_URL` and
`NUXT_PUBLIC_SUPABASE_KEY` using your Supabase project URL and publishable key.
Add the same variables in the Vercel project's environment-variable settings.
The publishable key is intended for client apps; never use a secret or
`service_role` key in the browser or commit credentials to Git.

Before enabling sign-in, run `supabase/migrations/202611250001_user_data.sql`
in the Supabase SQL Editor. It creates a private per-user data table protected
by row-level security, with a timestamp used to detect changes from another
device. Email/password and Google sign-in, plus password recovery, use Supabase
Auth. Enable Google under **Authentication → Providers** and configure its
OAuth credentials in Supabase. Set the Supabase Auth site's production URL and
allowed redirect URLs for your Vercel domain and local development URL so
Google sign-in and recovery emails return to the app.

The app imports local progress when an account has no saved data. If both the
account and this browser have progress, it asks which copy to keep before
syncing. Changes are saved to the account and remain persisted in browser
storage.

---

## 📁 Project Structure

```
upstreak/
├── assets/         # Global CSS + theme tokens
├── components/     # Reusable Vue components
├── composables/    # Shared logic (reminders, confetti)
├── layouts/        # App layout + onboarding
├── pages/          # Routes (index, goals, journal, stats, weekly, profile)
├── public/         # Static assets (favicon)
├── stores/         # Pinia state management
└── nuxt.config.ts  # Nuxt configuration
```

---

## 📄 License

© 2026 Wisani Chauke. All rights reserved.
