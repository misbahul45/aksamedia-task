<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import ForgotForm from '@/components/auth/ForgotForm.vue';

const container = ref<HTMLElement>();
const title = ref<HTMLElement>();
const formWrapper = ref<HTMLElement>();

onMounted(() => {
  if (!container.value || !title.value || !formWrapper.value) return;
  
  const tl = gsap.timeline();
  
  gsap.set([title.value, formWrapper.value], {
    opacity: 0,
    y: 30,
    scale: 0.95
  });

  tl.to(title.value, {
    duration: 0.8,
    opacity: 1,
    y: 0,
    scale: 1,
    ease: "power3.out"
  })
  .to(formWrapper.value, {
    duration: 0.6,
    opacity: 1,
    y: 0,
    scale: 1,
    ease: "power2.out"
  }, "-=0.3");

  gsap.to(title.value, {
    duration: 3,
    backgroundPosition: "200% center",
    ease: "none",
    repeat: -1,
    yoyo: true
  });
});
</script>

<template>
    <div 
        ref="container"
        class="w-full max-w-lg mx-auto pt-20"
    >
        <h1 
            ref="title"
            class="text-3xl font-bold text-center mb-8"
            style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                background-size: 200% 200%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            "
        >
            Change your password
        </h1>
        
        <div ref="formWrapper">
            <ForgotForm />
        </div>
    </div>
</template>