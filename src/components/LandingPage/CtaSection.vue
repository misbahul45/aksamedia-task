<template>
  <section class="py-24 sm:py-32">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Loved by productive people
        </h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Don't just take our word for it. Here's what our users are saying.
        </p>
      </div>
      <div class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <figure v-for="t in testimonials" :key="t.author" class="testimonial-card rounded-2xl bg-gray-50 dark:bg-zinc-800 p-8">
          <blockquote class="text-gray-900 dark:text-white">
            <p>"{{ t.quote }}"</p>
          </blockquote>
          <figcaption class="mt-6 flex items-center gap-x-4">
            <img class="h-10 w-10 rounded-full bg-gray-200" :src="t.avatarUrl" alt="">
            <div>
              <div class="font-semibold text-gray-900 dark:text-white">{{ t.author }}</div>
              <div class="text-gray-600 dark:text-gray-400">{{ t.role }}</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    quote: 'MemoGrow completely changed how I organize my projects. The integration of tasks and notes is seamless.',
    author: 'Sarah L.',
    role: 'Freelance Designer',
    avatarUrl: 'https://i.pravatar.cc/40?img=1'
  },
  {
    quote: 'Finally, an app that doesn\'t get in my way. Capturing ideas is instant, and the daily planner is a lifesaver.',
    author: 'Mike R.',
    role: 'Software Developer',
    avatarUrl: 'https://i.pravatar.cc/40?img=2'
  },
  {
    quote: 'As a student, keeping track of assignments and study notes was a nightmare. MemoGrow brought order to the chaos.',
    author: 'Jessica P.',
    role: 'University Student',
    avatarUrl: 'https://i.pravatar.cc/40?img=3'
  }
]

onMounted(() => {
  gsap.from('.testimonial-card', {
    scrollTrigger: {
      trigger: '.testimonial-card',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    ease: 'expo.out'
  })
})
</script>