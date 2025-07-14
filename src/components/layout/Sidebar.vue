<script setup lang="ts">
import { useAuth } from '@/stores/useAuth'
import { User, LogOut, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { sidebarMenu } from '@/constants'
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import Theme from '../ui/Theme.vue'

const auth = useAuth()
const { user } = storeToRefs(auth)
const isOpen = ref(true)
const router=useRouter()

function toggleSidebar() {
  isOpen.value = !isOpen.value
}

async function logout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="relative">
    <aside
      :class="[ 
        'relative h-screen flex flex-col justify-between bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-700 transition-all duration-300 overflow-visible',
        isOpen ? 'w-56' : 'w-fit'
      ]"
    >
      <div>
        <div class="flex items-center justify-between p-5">
          <RouterLink to="/" class="text-lg font-bold text-primary truncate">
            <span v-if="isOpen">Memo
              <span class="text-primary-secondary">Grow</span>
            </span>
            <span v-else>M</span>
          </RouterLink>
        </div>


        <nav class="space-y-1 mt-4 px-2">
          <RouterLink
            v-for="item in sidebarMenu"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white rounded-lg transition-colors"
            active-class="bg-primary text-white"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="isOpen" class="truncate font-semibold">{{ item.text }}</span>
          </RouterLink>
          <div class="flex gap-2 items-center justify-center">
            <span v-if="isOpen">Theme</span>
            <Theme />
          </div>
        </nav>
      </div>

      <div class="border-t border-gray-200 dark:border-zinc-700 px-4 py-3">
        <router-link to="/app/profile" class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <User class="w-4 h-4 text-white" />
          </div>
          <div v-if="isOpen" class="overflow-hidden flex-1">
            <p class="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
              {{ user?.username || 'Anonymous' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ user?.email || 'No email' }}
            </p>
          </div>
        </router-link>
        <button
          @click="logout"
          :class="[ 
            'w-full flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors',
            isOpen ? 'justify-start' : 'justify-center'
          ]"
        >
          <LogOut class="w-4 h-4 flex-shrink-0" />
          <span v-if="isOpen">Logout</span>
        </button>
      </div>
    </aside>

    <button 
      @click="toggleSidebar" 
      class="absolute top-6 -right-4 z-20 p-2 bg-white dark:bg-zinc-800 cursor-pointer border border-gray-300 dark:border-zinc-600 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
    >
      <ChevronLeft v-if="isOpen" class="w-4 h-4 text-gray-700 dark:text-gray-300" />
      <ChevronRight v-else class="w-4 h-4 text-gray-700 dark:text-gray-300" />
    </button>
  </div>
</template>
