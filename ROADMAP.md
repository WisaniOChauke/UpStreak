# UpStreak Product Roadmap

> Vision: become a private, premium operating system for an intentional life — combining habits, goals, projects, planning, journaling, reflection, and intelligent guidance.

Positioning:

> Plan deliberately. Live intentionally. Become your finest self.

---

## v1 — Foundation (Current)

### Daily productivity

- [x] Daily habit tracking with categories
- [x] Habit reordering
- [x] Streak and best-streak tracking
- [x] Goal creation with milestones
- [x] Goal progress tracking
- [x] Daily journal entries
- [x] Mood tracking
- [x] Journal search and history
- [x] Browser reminders
- [x] Onboarding flow

### Insights and experience

- [x] Weekly bar chart
- [x] Activity heatmap
- [x] Mood trend chart
- [x] Weekly review
- [x] Achievement system
- [x] XP and discipline rank system
- [x] Profile, avatar, themes, export, and reset
- [x] Confetti and encouragement feedback
- [x] Data persistence through localStorage

### Tech foundation

- [x] Nuxt 3
- [x] TypeScript
- [x] Pinia
- [x] Tailwind CSS
- [x] Chart.js
- [x] VueUse
- [x] Static client-side deployment

---

## v2 — Production SaaS Foundation

### Authentication and identity

- [ ] Email and password authentication
- [ ] Google OAuth
- [ ] Apple OAuth
- [ ] Passkey support
- [ ] Password reset
- [ ] Persistent secure sessions
- [ ] Account linking
- [ ] Account deletion and data erasure
- [ ] Timezone, locale, and notification preferences

### Cloud platform

- [ ] Supabase PostgreSQL data model
- [ ] Row-level security
- [ ] Server-side validation
- [ ] Real-time synchronization
- [ ] Offline-first Pinia synchronization
- [ ] Conflict-aware data merging
- [x] Migrate existing browser data to the new app identity
- [ ] Versioned backup and restore
- [ ] Export and import
- [ ] Soft deletion and recovery
- [ ] Corrupted local-data recovery

### Integrated daily planning

- [ ] Add daily priorities to Today
- [ ] Add time blocks and scheduling
- [ ] Add routines and routine templates
- [ ] Add morning, work, evening, and weekly plans
- [ ] Add weekday, interval, and custom schedules
- [ ] Add habit pause, skip, rest-day, and recovery rules
- [ ] Add timezone-safe date handling
- [ ] Correct streak calculations for missed calendar dates
- [ ] Centralize completion and streak updates
- [ ] Add per-habit reminders

### Workspaces

- [ ] Personal workspace
- [ ] Optional household or family workspace
- [ ] Projects containing habits, goals, tasks, and journal entries
- [ ] Workspace invitations
- [ ] Member roles
- [ ] Shared goals and routines
- [ ] Private journal isolation

### Calendar integration

- [ ] Google Calendar OAuth
- [ ] Microsoft Outlook support
- [ ] Apple Calendar support where applicable
- [ ] Import appointments as scheduling context
- [ ] Create time blocks from habits and goals
- [ ] Publish habit completion updates
- [ ] Detect scheduling conflicts
- [ ] Avoid reminders during unavailable time

### Billing and account operations

- [ ] Stripe or Polar billing
- [ ] Free, Personal, and Signature tiers
- [ ] Trial and usage limits
- [ ] Invoice history
- [ ] Cancellation, pause, and restoration
- [ ] Feature flags
- [ ] Admin dashboard
- [ ] Audit logs
- [ ] Subscription usage enforcement

### Quality and reliability

- [ ] Core unit tests
- [ ] Store migration tests
- [ ] Synchronization tests
- [ ] Authentication integration tests
- [ ] Billing webhook tests
- [ ] End-to-end critical-flow tests
- [ ] Error monitoring
- [ ] Application analytics
- [ ] Privacy and cookie controls

### SaaS launch requirements

- [ ] Terms of service
- [ ] Privacy policy
- [ ] Data retention policy
- [ ] Account deletion flow
- [ ] Accessibility pass
- [ ] SEO and social metadata
- [ ] Security headers
- [ ] Production database backups
- [ ] Status page

---

## v3 — Intelligence and Coaching

- [ ] Private AI daily briefing
- [ ] Pattern detection across habits, mood, and goals
- [ ] AI-powered habit recommendations
- [ ] Goal decomposition and milestone planning
- [ ] Calendar-aware scheduling
- [ ] Weekly AI review
- [ ] Quiet, contextual reminders
- [ ] Coaching that explains trends rather than producing noise
- [ ] User opt-in for personal AI analysis
- [ ] AI interaction history and controls
- [ ] AI data-processing disclosure
- [ ] Optional journal and personal-data encryption controls

AI should feel like a composed private concierge, not a noisy chatbot.

---

## v4 — Social and Community

- [ ] Private circles for family, partners, coaches, or friends
- [ ] Accountability partners
- [ ] Shared challenges
- [ ] Shared goals
- [ ] Opt-in public progress pages
- [ ] Club and community templates
- [ ] Moderation tools
- [ ] Weekly and annual review sharing
- [ ] Invite and referral system

Streak comparison and competition should remain secondary to consistency, reflection, and wellbeing.

---

## v5 — Cross-platform and Integrations

- [ ] Installable PWA
- [ ] iOS app
- [ ] Android app
- [ ] Apple Health integration
- [ ] Google Health integration
- [ ] Wearable integrations
- [ ] Home screen widgets
- [ ] Desktop app
- [ ] Browser extension
- [ ] Notion integration
- [ ] Todoist integration
- [ ] Linear integration
- [ ] Google Tasks integration
- [ ] Slack integration
- [ ] Public API
- [ ] Webhooks
- [ ] Zapier and Make integrations

---

## v6 — Premium and Organizations

- [ ] Team workspaces
- [ ] Executive and coaching programs
- [ ] Certified coach and practitioner tools
- [ ] Organization-level reporting
- [ ] SSO
- [ ] SCIM provisioning
- [ ] Advanced audit and compliance controls
- [ ] Dedicated support
- [ ] Managed onboarding
- [ ] Annual premium membership

---

## Backlog

- [ ] Habit templates marketplace
- [ ] Custom XP rules
- [ ] Pomodoro and focus timer integration
- [ ] Custom themes
- [ ] Annual reflection and milestone reports
- [ ] Location-aware routines
- [ ] Health and sleep integrations
- [ ] Voice capture for journal entries
- [ ] Offline note attachments
- [ ] Premium report exports
- [ ] Community-created routine packs

---

## Branding

The product identity is UpStreak. Domain and trademark clearance remain launch prerequisites.

- [ ] Register and verify domains
- [ ] Complete trademark clearance in target markets
- [ ] Create a premium wordmark and symbol
- [x] Replace favicon
- [x] Update store key and schema namespace
- [x] Update page titles and metadata
- [x] Update README and roadmap
- [x] Update notifications and exported data
- [ ] Configure redirects and migration messaging when the new domain is selected

The preferred brand direction should feel calm, composed, discreet, and enduring rather than gamified or clinical.
