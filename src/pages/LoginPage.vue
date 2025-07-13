<script setup lang="ts">
import AuthForm from '@/components/auth/AuthForm.vue';
import { onMounted } from 'vue';
import { gsap } from 'gsap';

onMounted(() => {
  gsap.fromTo('.brand-name', 
    { 
      opacity: 0, 
      x: 20 
    }, 
    { 
      opacity: 1, 
      x: 0, 
      duration: 0.8, 
      delay: 0.5,
      ease: "power2.out" 
    }
  );
  
  gsap.fromTo('.description', 
    { 
      opacity: 0, 
      y: 20 
    }, 
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      delay: 0.8,
      ease: "power2.out" 
    }
  );
  
  gsap.fromTo('.auth-form', 
    { 
      opacity: 0, 
      y: 30 
    }, 
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      delay: 1.2,
      ease: "power2.out" 
    }
  );
});
</script>

<template>
    <main class="w-full px-4 space-y-4 pt-28">
        <div class="text-center w-full max-w-xl mx-auto">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white tracking-tight mb-6">
                Login to
                <span class="brand-name text-primary text-4xl sm:text-5xl font-extrabold animate-pulse ml-2">
                    Memo<span class="text-primary-secondary">Grow</span>
                </span>
            </h1>

            <p class="description text-gray-600 mt-2 tracking-wider">
                Organize your tasks and projects with ease. MemoGrow is a powerful task management application 
                that helps you stay productive and collaborate with your team, similar to Trello.
            </p>
        </div>
        <div class="w-full max-w-xl auth-form mx-auto">
            <AuthForm />
        </div>
    </main>
</template>