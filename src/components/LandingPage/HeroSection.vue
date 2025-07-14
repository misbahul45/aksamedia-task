<template>
  <section class="relative isolate overflow-hidden pt-32 pb-40 bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 lg:gap-x-12 lg:items-center">
        <div class="text-center lg:text-left">
          <h1 ref="title" class="text-4xl sm:text-6xl font-extrabold leading-tight text-primary dark:text-primary-light">
            MemoGrow
          </h1>
          <p ref="paragraph" class="mt-6 max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Capture ideas, plan your days, and grow your productivity — all in one place.
          </p>
          <div ref="buttons" class="mt-10 flex justify-center lg:justify-start gap-4">
            <RouterLink to="/login" class="inline-block px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition">
              Get Started
            </RouterLink>
            <RouterLink to="/app/inbox" class="inline-block px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 font-semibold transition">
              Live Demo
            </RouterLink>
          </div>
        </div>
        <div ref="illustration" class="mt-16 lg:mt-0 relative h-80 lg:h-96">
          <svg viewBox="0 0 400 300" class="absolute inset-0 w-full h-full">
            <g class="hero-svg-el" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="50" y="50" width="220" height="200" rx="12" class="stroke-primary/30 dark:stroke-primary/50" />
              <path d="M 80 100 h 120" class="stroke-gray-400/50 dark:stroke-gray-500/50" />
              <path d="M 80 140 h 160" class="stroke-gray-400/50 dark:stroke-gray-500/50" />
              <path d="M 80 180 h 80" class="stroke-gray-400/50 dark:stroke-gray-500/50" />
            </g>
            <g class="hero-svg-el" transform="translate(200, 160) scale(0.9)">
              <rect x="40" y="20" width="160" height="120" rx="8" class="fill-white dark:fill-zinc-800 stroke-2 stroke-primary/60" />
              <circle cx="65" cy="45" r="5" class="fill-primary/50" />
              <path d="M 85 45 h 60" class="stroke-gray-400/70 dark:stroke-gray-500/70" stroke-width="4" />
              <circle cx="65" cy="75" r="5" class="fill-primary/50" />
              <path d="M 85 75 h 80" class="stroke-gray-400/70 dark:stroke-gray-500/70" stroke-width="4" />
            </g>
            <g class="hero-svg-el" transform="translate(-20, 20)">
               <path d="M 300 40 C 340 40, 360 80, 360 120 S 340 200, 300 200" stroke-width="10" stroke-linecap="round" fill="none" class="stroke-primary/80 dark:stroke-primary-light/80" />
               <circle cx="360" cy="120" r="15" class="fill-primary dark:fill-primary-light" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const title = ref<HTMLElement | null>(null)
const paragraph = ref<HTMLElement | null>(null)
const buttons = ref<HTMLElement | null>(null)
const illustration = ref<HTMLElement | null>(null)

onMounted(() => {
  const tl = gsap.timeline({
    defaults: { duration: 0.8, ease: 'power3.out', opacity: 0, y: 30 }
  })

  tl.from(title.value, {})
    .from(paragraph.value, {}, '-=0.6')
    .from(buttons.value, {}, '-=0.6')
    .from('.hero-svg-el', { scale: 0.8, stagger: 0.15, opacity: 0 }, '-=0.5')
})
</script>