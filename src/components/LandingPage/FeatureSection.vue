<template>
  <section class="py-24 sm:py-32 bg-gray-50 dark:bg-zinc-800">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Features that empower your workflow
        </h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Everything you need to turn chaos into clarity.
        </p>
      </div>
      <div class="mt-16 grid gap-12 md:grid-cols-3">
        <div v-for="f in features" :key="f.title" class="feature-card space-y-4 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <component :is="f.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ f.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ f.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ClipboardList, CheckSquare, CalendarCheck } from 'lucide-vue-next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  { icon: ClipboardList, title: 'Smart Inbox', text: 'Capture tasks and notes instantly, tag them, and never lose an idea again.' },
  { icon: CheckSquare, title: 'Kanban Boards', text: 'Drag‑and‑drop cards to visualise progress and keep projects moving.' },
  { icon: CalendarCheck, title: 'Daily Planner', text: 'Turn your tasks into a schedule and hit every deadline with ease.' }
]

onMounted(() => {
  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.feature-card',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    scale: 0.95,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power3.out'
  })
})
</script>