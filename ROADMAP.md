# 🗺 Dayloom Roadmap

## ✅ v1 — Current (Live)

- Daily habit tracking with categories, drag reorder, streaks
- Goal creation with milestones and progress tracking
- Journal with mood tracking, search, and history
- Stats — weekly bar chart, activity heatmap, mood trend
- Weekly review page
- Achievements and XP system
- Discipline rank system (Wanderer → Enlightened)
- Profile page — avatar, themes, data export, reset
- 4 themes — Default, Forest, Ocean, Minimal (light + dark)
- Browser reminders
- Onboarding flow
- Data stored locally (localStorage via Pinia)

---

## 🔜 v2 — Auth & Cloud Sync

### Authentication
- [ ] Email + password sign-in
- [ ] Google OAuth login
- [ ] Persistent session across devices

### Cloud Sync
- [ ] Migrate localStorage store to Supabase
- [ ] Real-time sync across devices
- [ ] Data backup and restore

### Personalized Onboarding
- [ ] Add "What describes you?" step to onboarding (Student, Professional, Athlete, Creative, etc.)
- [ ] Save user role to profile store
- [ ] Use role to pre-filter and weight habit suggestions
- [ ] Personalize goal suggestions based on role
- [ ] Adjust dashboard tone and content to match user lifestyle

### Calendar Integration
- [ ] Google Calendar OAuth
- [ ] Pull in existing appointments as habit reminders
- [ ] Sync habit completions back to calendar
- [ ] Outlook / Apple Calendar support

---

## 🔮 v3 — Social & Intelligence

- [ ] Share progress / streaks publicly
- [ ] Friend accountability system
- [ ] AI habit suggestions based on your patterns
- [ ] Smart reminders based on calendar availability
- [ ] Weekly email digest

---

## 💡 Backlog

- [ ] Mobile app (Capacitor or React Native)
- [ ] Widget support
- [ ] Habit templates marketplace
- [ ] Custom XP rules per habit
- [ ] Pomodoro timer integration
