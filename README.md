# 🌅 DayLoom

> Weave your day — habits, goals, and journal in one place.

🔗 **Live:** [dayloom.app](https://day-loom.vercel.app/)

DayLoom is a personal productivity app that helps you track daily habits, set goals, and reflect through journaling — all in a clean, minimal interface.

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

---

## 📁 Project Structure

```
dayloom/
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

© 2025 Wisani Chauke. All rights reserved.
