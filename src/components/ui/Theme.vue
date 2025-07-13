<script lang="ts" setup>
import { ref } from 'vue'
import { useTheme } from '@/composable/useTheme'
import type { Web_Theme } from '@/interfaces'
import { Sun, Moon, Monitor } from 'lucide-vue-next'

const dropdownVisible = ref(false)
const { theme, setTheme } = useTheme()

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor }
]

function toggleDropdown() {
  dropdownVisible.value = !dropdownVisible.value
}

function handleSelect(t: Web_Theme) {
  setTheme(t)
  dropdownVisible.value = false
}
</script>

<template>
  <div class="relative inline-block">
    <button
      @click="toggleDropdown"
      class="rounded-full p-2 bg-gray-100 dark:bg-zinc-800 cursor-pointer shadow hover:shadow-md transition-all border border-gray-200 dark:border-zinc-700"
    >
      <Sun v-if="theme === 'light'" class="w-5 h-5 primary" />
      <Moon v-else-if="theme === 'dark'" class="w-5 h-5 text-primary-secondary" />
      <Monitor v-else class="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>

    <div
      v-if="dropdownVisible"
      class="absolute left-1/2 -translate-x-1/2 mt-4 w-44 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 z-50"
    >
      <button
        v-for="(opt, index) in themeOptions"
        :key="opt.value"
        @click="handleSelect(opt.value as Web_Theme)"
        class="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        :class="[{
          'bg-primray/50 dark:bg-primray/80 text-primary/90 dark:text-primary': theme === opt.value
        },
        {
          'rounded-t-lg': index===0 || index===2
        }]"
      >
        <component :is="opt.icon" class="w-4 h-4" />
        <span>{{ opt.label }}</span>
      </button>
    </div>
  </div>
</template>
