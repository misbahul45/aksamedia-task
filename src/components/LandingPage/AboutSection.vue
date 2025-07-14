<template>
  <section ref="sectionRef" class="py-24 sm:py-32">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div ref="textContainer" class="space-y-6">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Why MemoGrow?</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            MemoGrow unifies notes, tasks, boards, and daily plans under a single intuitive interface
            so you can stay organised without switching apps. It's designed to be your second brain,
            powerful yet simple to use.
          </p>
        </div>
        <div ref="mockupContainer" class="mt-12 md:mt-0">
          <div class="p-2 rounded-xl bg-primary/10 dark:bg-primary/20">
            <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 space-y-3">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-red-400"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span class="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <div class="h-4 w-1/3 rounded bg-gray-200 dark:bg-zinc-700"></div>
              <div class="h-16 rounded bg-gray-200 dark:bg-zinc-700"></div>
              <div class="grid grid-cols-3 gap-3">
                <div class="h-24 rounded bg-gray-200 dark:bg-zinc-700"></div>
                <div class="h-24 rounded bg-gray-200 dark:bg-zinc-700"></div>
                <div class="h-24 rounded bg-gray-200 dark:bg-zinc-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const textContainer = ref<HTMLElement | null>(null)
const mockupContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  const trigger = sectionRef.value
  if (!trigger) return

  gsap.from(textContainer.value, {
    scrollTrigger: { trigger, start: 'top 80%' },
    opacity: 0,
    x: -50,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.from(mockupContainer.value, {
    scrollTrigger: { trigger, start: 'top 80%' },
    opacity: 0,
    x: 50,
    duration: 1,
    ease: 'power3.out'
  })
})
</script>