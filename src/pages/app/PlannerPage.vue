<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useInboxStore } from '@/stores/useInbox'
import { gsap } from 'gsap'

type Task = typeof inbox.tasks[0]

const inbox = useInboxStore()
const now = new Date()

const month = ref(now.getMonth())
const year = ref(now.getFullYear())

const calendarRef = ref<HTMLElement | null>(null)
const dialogRef = ref<HTMLElement | null>(null)
const dialogBackdropRef = ref<HTMLElement | null>(null)
const selectedTask = ref<Task | null>(null)

const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getStartDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay()
}

const days = computed(() => {
  const total = getDaysInMonth(month.value, year.value)
  const startDay = getStartDayOfMonth(month.value, year.value)
  const arr = Array(startDay).fill(null)
  for (let i = 1; i <= total; i++) arr.push(i)
  return arr
})

const filteredTasks = computed(() => {
  return inbox.tasks.filter(task => task.plannerDate)
})

const tasksByDate = computed(() => {
  const map: Record<string, Task[]> = {}
  filteredTasks.value.forEach(task => {
    const date = new Date(task.plannerDate!).toISOString().slice(0, 10)
    if (!map[date]) map[date] = []
    map[date].push(task)
  })
  return map
})

function getDateString(day: number) {
  return `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function isToday(day: number) {
  return (
    day === now.getDate() &&
    month.value === now.getMonth() &&
    year.value === now.getFullYear()
  )
}

function prevMonth() {
  if (month.value === 0) {
    month.value = 11
    year.value -= 1
  } else {
    month.value -= 1
  }
}


function nextMonth() {
  if (month.value === 11) {
    month.value = 0
    year.value += 1
  } else {
    month.value += 1
  }
}

function openDialog(task: Task) {
  selectedTask.value = task
}

function closeDialog() {
  if (!dialogRef.value) return

  gsap.to(dialogBackdropRef.value, { opacity: 0, duration: 0.3 })
  gsap.to(dialogRef.value, {
    opacity: 0,
    scale: 0.95,
    y: -10,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      selectedTask.value = null
    }
  })
}

watch(selectedTask, (newValue) => {
  if (newValue) {
    nextTick(() => {
      gsap.fromTo(dialogBackdropRef.value, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(dialogRef.value, { opacity: 0, scale: 0.95, y: -10 }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out'
      })
      gsap.from('.subtask-dialog-item', {
        opacity: 0,
        x: -15,
        stagger: 0.05,
        delay: 0.2,
        duration: 0.3
      })
    })
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && selectedTask.value) {
    closeDialog()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  nextTick(() => {
    if (calendarRef.value) {
      gsap.from(calendarRef.value.children, {
        opacity: 0,
        y: 20,
        stagger: 0.02,
        duration: 0.5,
        ease: 'power2.out'
      })
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Planner</h2>
      <div class="flex items-center gap-2">
        <button @click="prevMonth" class="px-3 py-1 rounded-md bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors">‹</button>
        <span class="text-lg font-semibold w-40 text-center text-gray-700 dark:text-gray-200">
          {{ new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' }) }}
        </span>
        <button @click="nextMonth" class="px-3 py-1 rounded-md bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors">›</button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
      <div v-for="d in daysInWeek" :key="d">{{ d }}</div>
    </div>

    <div ref="calendarRef" class="grid grid-cols-7 gap-2">
      <div
        v-for="(day, i) in days"
        :key="i"
        class="min-h-[120px] rounded-lg border flex flex-col p-2 transition-colors"
        :class="{
          'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800': day,
          'bg-gray-50 dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800/50': !day
        }"
      >
        <div v-if="day" class="flex justify-end">
          <span
            class="flex items-center justify-center h-6 w-6 rounded-full text-xs font-semibold"
            :class="isToday(day) ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400'"
          >
            {{ day }}
          </span>
        </div>
        <div v-if="day && tasksByDate[getDateString(day)]" class="space-y-1.5 mt-1 flex-grow">
          <div
            v-for="task in tasksByDate[getDateString(day)]"
            :key="task.id"
            @click="openDialog(task)"
            class="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-semibold truncate cursor-pointer hover:bg-primary/20 transition-colors"
          >
            {{ task.title }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="selectedTask" class="fixed inset-0 z-50 flex items-center justify-center">
    <div ref="dialogBackdropRef" @click="closeDialog" class="absolute inset-0 bg-black/40"></div>
    <div ref="dialogRef" class="relative bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-lg m-4">
      <div class="p-6">
        <div class="flex justify-between items-start">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ selectedTask.title }}</h3>
          <button @click="closeDialog" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="mt-4 border-t border-gray-200 dark:border-zinc-700 pt-4">
          <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">Subtasks</h4>
          <ul v-if="selectedTask.subtasks && selectedTask.subtasks.length > 0" class="space-y-2">
            <li v-for="sub in selectedTask.subtasks" :key="sub.id" class="flex items-center subtask-dialog-item">
              <span class="mr-3">
                <svg v-if="sub.status === 'done'" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                <svg v-else class="w-5 h-5 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path></svg>
              </span>
              <span class="text-gray-800 dark:text-gray-200" :class="{ 'line-through text-gray-500 dark:text-gray-400': sub.status === 'done' }">
                {{ sub.title }}
              </span>
            </li>
          </ul>
          <p v-else class="text-gray-500 dark:text-gray-400 text-sm">No subtasks for this item.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>