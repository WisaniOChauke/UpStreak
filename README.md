# 🌅 DayLoom

> Weave your day — habits, goals, and journal in one place.

DayLoom is a personal productivity app that helps you track daily habits, set goals, and reflect through journaling — all in a clean, minimal interface.

---

## ✨ Features

- **Today** — Check off daily habits and stay on track
- **Goals** — Set and monitor short and long-term goals
- **Journal** — Write daily reflections and notes
- **Stats** — Visualise your progress with charts and heatmaps
- **Achievements** — Earn badges as you build consistency
- **Reminders** — Get nudged to stay on top of your habits
- **Confetti** — Celebrate wins 🎉

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 3](https://nuxt.com/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
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
├── assets/         # Global CSS
├── components/     # Reusable Vue components
├── composables/    # Shared logic (reminders, confetti)
├── layouts/        # App layout
├── pages/          # Routes (index, goals, journal, stats)
├── stores/         # Pinia state management
└── nuxt.config.ts  # Nuxt configuration
```

---

## 📄 License

MIT
