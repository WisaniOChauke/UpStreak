import { defineStore } from 'pinia'
import { persistedState } from '#imports'

export type HabitCategory = 'health' | 'work' | 'personal' | 'fitness' | 'learning' | 'other'

export interface Habit {
  id: string
  name: string
  icon: string
  color: string
  category: HabitCategory
  completedDates: string[]
  streak: number
  xpReward: number
  notes?: string
  bestStreak?: number
}

export type Theme = 'default' | 'forest' | 'ocean' | 'minimal'

export interface Goal {
  id: string
  title: string
  description: string
  progress: number
  target: number
  unit: string
  dueDate: string
  color: string
  completed: boolean
  milestones: { label: string; done: boolean }[]
}

export interface JournalEntry {
  id: string
  date: string
  content: string
  mood: 'great' | 'good' | 'okay' | 'bad'
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string | null
}

const today = () => new Date().toISOString().split('T')[0]

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_habit',    title: 'First Step',      description: 'Complete your first habit',          icon: '👣', unlockedAt: null },
  { id: 'streak_7',       title: 'Week Warrior',     description: 'Reach a 7-day streak on any habit',  icon: '🔥', unlockedAt: null },
  { id: 'streak_30',      title: 'Iron Will',        description: 'Reach a 30-day streak',              icon: '💪', unlockedAt: null },
  { id: 'perfect_day',    title: 'Perfect Day',      description: 'Complete all habits in one day',     icon: '⭐', unlockedAt: null },
  { id: 'first_goal',     title: 'Goal Getter',      description: 'Complete your first goal',           icon: '🎯', unlockedAt: null },
  { id: 'first_journal',  title: 'Dear Diary',       description: 'Write your first journal entry',     icon: '📓', unlockedAt: null },
  { id: 'level_5',        title: 'Rising Star',      description: 'Reach Level 5',                      icon: '🌟', unlockedAt: null },
  { id: 'xp_500',         title: 'XP Grinder',       description: 'Earn 500 total XP',                  icon: '💎', unlockedAt: null },
]

export const useDayloomStore = defineStore('dayloom', {
  state: () => ({
    xp: 0,
    darkMode: false,
    theme: 'default' as Theme,
    profile: { name: '', avatar: '🌅' },
    habits: [] as Habit[],
    goals: [] as Goal[],
    journal: [] as JournalEntry[],
    achievements: ALL_ACHIEVEMENTS as Achievement[],
    reminderTime: '08:00',
    remindersEnabled: false,
    dismissedSuggestions: [] as string[],
    removedHabits: [] as Habit[],
  }),

  getters: {
    level: (state) => Math.floor(state.xp / 200) + 1,
    xpPercent: (state) => ((state.xp % 200) / 200) * 100,
    xpToNext: (state) => 200 - (state.xp % 200),

    rank: (state) => {
      const lv = Math.floor(state.xp / 200) + 1
      const ranks = [
        { min: 1,  icon: '🌱', title: 'Wanderer' },
        { min: 2,  icon: '📖', title: 'Apprentice' },
        { min: 3,  icon: '🔍', title: 'Seeker' },
        { min: 4,  icon: '🎯', title: 'Focused' },
        { min: 5,  icon: '💪', title: 'Disciplined' },
        { min: 6,  icon: '⚔️',  title: 'Warrior' },
        { min: 7,  icon: '🧘', title: 'Sage' },
        { min: 8,  icon: '🌙', title: 'Monk' },
        { min: 9,  icon: '⚡',  title: 'Ascetic' },
        { min: 10, icon: '🌟', title: 'Enlightened' },
      ]
      return ranks.slice().reverse().find(r => lv >= r.min) ?? ranks[0]
    },

    todayHabits: (state) =>
      state.habits.map(h => ({ ...h, doneToday: h.completedDates.includes(today()) })),

    completedToday: (state) =>
      state.habits.filter(h => h.completedDates.includes(today())).length,

    allDoneToday: (state) =>
      state.habits.length > 0 && state.habits.every(h => h.completedDates.includes(today())),

    todayEntry: (state) =>
      state.journal.find(e => e.date === today()) ?? null,

    unlockedAchievements: (state) =>
      state.achievements.filter(a => a.unlockedAt !== null),

    weeklyStats: (state) => {
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return d.toISOString().split('T')[0]
      })
      return days.map(date => ({
        date,
        label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        completed: state.habits.filter(h => h.completedDates.includes(date)).length,
        total: state.habits.length,
      }))
    },

    moodHistory: (state) =>
      [...state.journal].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7),
  },

  actions: {
    toggleHabit(id: string) {
      const habit = this.habits.find(h => h.id === id)
      if (!habit) return
      const t = today()
      if (habit.completedDates.includes(t)) {
        habit.completedDates = habit.completedDates.filter(d => d !== t)
        habit.streak = Math.max(0, habit.streak - 1)
        this.xp = Math.max(0, this.xp - habit.xpReward)
      } else {
        habit.completedDates.push(t)
        habit.streak += 1
        if (habit.streak > (habit.bestStreak ?? 0)) habit.bestStreak = habit.streak
        this.xp += habit.xpReward
        this.checkAchievements()
      }
    },

    updateHabit(id: string, fields: Partial<Pick<Habit, 'name' | 'icon' | 'category' | 'notes' | 'xpReward'>>) {
      const habit = this.habits.find(h => h.id === id)
      if (habit) Object.assign(habit, fields)
    },

    addHabit(habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) {
      this.habits.push({ ...habit, id: Date.now().toString(), completedDates: [], streak: 0 })
    },

    reorderHabits(from: number, to: number) {
      const h = this.habits.splice(from, 1)[0]
      this.habits.splice(to, 0, h)
    },

    addGoal(goal: Omit<Goal, 'id' | 'completed' | 'progress'>) {
      this.goals.push({ ...goal, id: Date.now().toString(), completed: false, progress: 0 })
    },

    deleteHabit(id: string) {
      const habit = this.habits.find(h => h.id === id)
      if (habit) {
        // only save to removed if it's not a built-in suggestion
        this.removedHabits = [habit, ...this.removedHabits.filter(h => h.id !== id)].slice(0, 10)
      }
      this.habits = this.habits.filter(h => h.id !== id)
    },

    reAddHabit(habit: Habit) {
      this.habits.push(habit)
      this.removedHabits = this.removedHabits.filter(h => h.id !== habit.id)
    },

    deleteGoal(id: string) {
      this.goals = this.goals.filter(g => g.id !== id)
    },

    completeGoal(id: string) {
      const goal = this.goals.find(g => g.id === id)
      if (!goal || goal.completed) return
      goal.completed = true
      goal.progress = goal.target
      goal.milestones.forEach(m => m.done = true)
      this.xp += 100
      this.checkAchievements()
    },

    saveJournalEntry(content: string, mood: JournalEntry['mood']) {
      const existing = this.journal.find(e => e.date === today())
      if (existing) {
        existing.content = content
        existing.mood = mood
      } else {
        this.journal.push({ id: Date.now().toString(), date: today(), content, mood })
        this.xp += 10
        this.checkAchievements()
      }
    },

    updateGoalProgress(id: string, value: number) {
      const goal = this.goals.find(g => g.id === id)
      if (!goal) return
      goal.progress = Math.min(value, goal.target)
      // auto-update milestones based on progress percentage
      const pct = goal.progress / goal.target
      goal.milestones.forEach((m, i) => {
        m.done = pct >= (i + 1) / goal.milestones.length
      })
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode
    },

    migrateHabits() {
      this.habits.forEach(h => { if (!h.category) h.category = 'other' })
    },

    unlockAchievement(id: string) {
      const a = this.achievements.find(a => a.id === id)
      if (a && !a.unlockedAt) a.unlockedAt = new Date().toISOString()
    },

    checkAchievements() {
      const t = today()
      if (this.habits.some(h => h.completedDates.includes(t))) this.unlockAchievement('first_habit')
      if (this.habits.some(h => h.streak >= 7))  this.unlockAchievement('streak_7')
      if (this.habits.some(h => h.streak >= 30)) this.unlockAchievement('streak_30')
      if (this.allDoneToday) this.unlockAchievement('perfect_day')
      if (this.goals.some(g => g.completed))     this.unlockAchievement('first_goal')
      if (this.journal.length >= 1)              this.unlockAchievement('first_journal')
      if (this.level >= 5)                       this.unlockAchievement('level_5')
      if (this.xp >= 500)                        this.unlockAchievement('xp_500')
    },

    setReminder(time: string, enabled: boolean) {
      this.reminderTime = time
      this.remindersEnabled = enabled
    },

    setProfile(name: string, avatar: string) {
      this.profile.name = name
      this.profile.avatar = avatar
    },

    setName(name: string) {
      this.profile.name = name
    },

    setTheme(theme: Theme) {
      this.theme = theme
    },

    resetProgress() {
      this.xp = 0
      this.habits.forEach(h => { h.completedDates = []; h.streak = 0 })
      this.journal = []
      this.achievements.forEach(a => { a.unlockedAt = null })
    },

    dismissSuggestion(name: string) {
      if (!this.dismissedSuggestions.includes(name)) this.dismissedSuggestions.push(name)
    },

    restoreSuggestion(name: string) {
      this.dismissedSuggestions = this.dismissedSuggestions.filter(n => n !== name)
    },
  },

  persist: {
    key: 'dayloom-v1',
    storage: persistedState.localStorage,
  },
})
