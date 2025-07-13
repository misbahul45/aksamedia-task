<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/stores/useAuth'
import {
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  UserCircle,
  Loader
} from 'lucide-vue-next'
import Theme from '../ui/Theme.vue'
import { storeToRefs } from 'pinia'

const dropdownVisible = ref(false)
const loadingRef=ref(false)
const auth = useAuth()
const { isLoggedIn, user } = storeToRefs(auth)


const router = useRouter()
const route=useRoute()

const pathName=computed(()=>route.path)

function toggleDropdown() {
  dropdownVisible.value = !dropdownVisible.value
}

async function handleLogout() {
  loadingRef.value=true
  await auth.logout()
  dropdownVisible.value=false
  router.push('/login')
  loadingRef.value=false
}
</script>

<template>
  <header
    v-if="!pathName.includes('app')"
    class="w-full backdrop-blur-md md:px-20 sm:px-12 px-4 flex justify-between bg-gray-900/20 items-center fixed top-0 left-0 py-4 z-30 border-b border-white/10"
  >
    <router-link
      to="/"
      class="text-xl font-bold text-primary transition-colors duration-300 hover:text-primary/80"
    >
      Memo<span class="text-primary-secondary">Grow</span>
    </router-link>

    <div class="flex gap-4 items-center">
      <Theme />

      <router-link
        v-if="!isLoggedIn"
        to="/login"
        class="px-6 py-2.5 bg-primary hover:bg-primary/90 rounded-lg shadow-xl font-semibold text-white transition-all duration-300 hover:shadow-2xl"
      >
        Join&nbsp;Us
      </router-link>

      <div v-else class="relative">
        <button
          @click="toggleDropdown"
          class="cursor-pointer text-primary/80 bg-primary/20 hover:bg-primary/80 hover:text-white px-4 py-2.5 flex items-center gap-2 font-semibold rounded-lg transition-all duration-300 border border-primary/20 hover:border-primary/40"
        >
          <User class="size-6" />
          <p class="truncate max-w-24">{{ user?.username || 'anonymous' }}</p>
          <ChevronDown
            class="w-4 h-4 transition-transform duration-300"
            :class="{ 'rotate-180': dropdownVisible }"
          />
        </button>

        <div
          v-if="dropdownVisible"
          class="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 text-sm shadow-xl rounded-xl ring-1 ring-black/10 dark:ring-white/10 z-50"
        >
          <div class="p-3 border-b border-gray-200 dark:border-zinc-700">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <UserCircle class="w-5 h-5 text-primary" />
              </div>
              <div class="w-full overflow-hidden">
                <p class="font-medium text-gray-900 dark:text-white truncate max-w-full overflow-hidden whitespace-nowrap">
                  {{ user?.username || 'Anonymous' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full overflow-hidden whitespace-nowrap">
                  {{ user?.email || 'No email' }}
                </p>
              </div>
            </div>
          </div>

          <div class="py-1">
            <router-link
              to="/app/inbox"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              @click="dropdownVisible = false"
            >
              <LayoutDashboard class="size-4 text-gray-600 dark:text-gray-400" />
              <span class="font-medium">Dashboard</span>
            </router-link>

            <router-link
              to="/app/profile"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              @click="dropdownVisible = false"
            >
              <Settings class="size-4 text-gray-600 dark:text-gray-400" />
              <span class="font-medium">Settings</span>
            </router-link>
          </div>

          <div class="border-t border-gray-200 dark:border-zinc-700">
            <button
              @click="handleLogout"
              class="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut class="size-4" />
              <span v-if="!loadingRef" class="font-medium">Logout</span>
              <span v-if="loadingRef" class="flex gap-2 items-center font-medium">
                <Loader class="size-4 animate-spin" />
                Logging out...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
