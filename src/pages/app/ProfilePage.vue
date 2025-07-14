<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Pencil, Save, X } from 'lucide-vue-next'
import { useAuth } from '@/stores/useAuth'
import { useToast } from '@/composable/useToast'
import { gsap } from 'gsap'

const auth = useAuth()
const isEdit = ref(false)
const username = ref(auth.user?.username || '')
const email = ref(auth.user?.email || '')
const bio = ref(auth.user?.bio || '')
const sectionRef = ref<HTMLElement | null>(null)
const { toast } = useToast()

function cancelEdit() {
  isEdit.value = false
  username.value = auth.user?.username || ''
  email.value = auth.user?.email || ''
  bio.value = auth.user?.bio || ''
}

function saveEdit() {
  auth.updateUser({
    username: username.value,
    email: email.value,
    bio: bio.value
  })

  toast({
    message: 'Profile updated successfully',
    type: 'success'
  })

  isEdit.value = false
}

onMounted(() => {
  nextTick(() => {
    if (sectionRef.value) {
      gsap.from(sectionRef.value.children, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out'
      })
    }
  })
})
</script>

<template>
  <div ref="sectionRef" class="max-w-3xl mx-auto py-12 px-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-primary flex items-center gap-2">
        <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A3 3 0 017 17h10a3 3 0 011.879.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Profile
      </h2>
      <button @click="isEdit ? cancelEdit() : isEdit = true" class="text-gray-600 hover:text-primary rounded-full p-2 transition">
        <component :is="isEdit ? X : Pencil" class="w-5 h-5" />
      </button>
    </div>

    <div class="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
        <template v-if="isEdit">
          <input v-model="username" class="w-full px-4 py-2 mt-1 border rounded-lg border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary" />
        </template>
        <p v-else class="mt-1 text-gray-800 dark:text-gray-200 font-medium">{{ auth.user?.username }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <template v-if="isEdit">
          <input v-model="email" class="w-full px-4 py-2 mt-1 border rounded-lg border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary" />
        </template>
        <p v-else class="mt-1 text-gray-800 dark:text-gray-200 font-medium">{{ auth.user?.email }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
        <template v-if="isEdit">
          <textarea v-model="bio" rows="4" class="w-full px-4 py-2 mt-1 border rounded-lg border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary" />
        </template>
        <p v-else class="mt-1 text-gray-800 dark:text-gray-200 font-medium whitespace-pre-line">{{ auth.user?.bio || '—' }}</p>
      </div>

      <div v-if="isEdit" class="flex justify-end">
        <button @click="saveEdit" class="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition">
          <Save class="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  </div>
</template>
