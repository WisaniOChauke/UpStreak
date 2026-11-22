<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from 'chart.js'
import { useUpstreakStore } from '~/stores/upstreak'
import { storeToRefs } from 'pinia'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler)

const { moodHistory } = storeToRefs(useUpstreakStore())

const moodScore = (mood: string) => ({ great: 4, good: 3, okay: 2, bad: 1 }[mood] ?? 2)

const entries = computed(() => [...moodHistory.value].reverse())

const chartData = computed(() => ({
  labels: entries.value.map(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
  datasets: [{
    data: entries.value.map(e => moodScore(e.mood)),
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 2,
    pointBackgroundColor: '#F59E0B',
    pointRadius: 4,
    tension: 0.4,
    fill: true,
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: {
    callbacks: { label: (ctx: any) => ['', 'Bad', 'Okay', 'Good', 'Great'][ctx.raw] }
  }},
  scales: {
    y: { min: 0, max: 5, ticks: { stepSize: 1, callback: (v: any) => ['', 'Bad', 'Okay', 'Good', 'Great'][v] ?? '' }, grid: { color: 'rgba(0,0,0,0.04)' } },
    x: { grid: { display: false } }
  }
}
</script>
