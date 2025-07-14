<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Pencil, Search, Trash2 } from 'lucide-vue-next'
import FormInbox from '@/components/Inbox/FormInbox.vue'
import type { InboxTask } from '@/interfaces'
import { useInboxStore } from '@/stores/useInbox'
import type { InboxTaskType } from '@/schemas/inbox.schema'
// @ts-ignore
import { debounce } from 'lodash-es'

const route = useRoute()
const router = useRouter()

const formInboxRef = ref<InstanceType<typeof FormInbox> | null>(null)
const isFormOpen = ref(false)
const editingTask = ref<InboxTask | undefined>(undefined)

const searchQuery = ref(route.query.search?.toString() || '')
const selectedPriority = ref(route.query.priority?.toString() || 'all')
const selectedStatus = ref(route.query.status?.toString() || 'all')
const currentPage = ref(parseInt(route.query.page as string) || 1)

const isSearchMode = ref(Boolean(searchQuery.value || selectedPriority.value !== 'all' || selectedStatus.value !== 'all'))

const itemsPerPage = 10
const isLoading = ref(false)
const hasMore = ref(true)

const scrollContainer = ref<HTMLElement | null>(null)
const taskElements = ref<HTMLElement[]>([])

const inbox = useInboxStore()

const filteredTasks = computed(() => {
  let tasks = inbox.tasks
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
  }
  if (selectedPriority.value !== 'all') tasks = tasks.filter(t => (t.priority || 'medium') === selectedPriority.value)
  if (selectedStatus.value !== 'all') tasks = tasks.filter(t => t.status === selectedStatus.value)
  return tasks
})

const displayedTasks = computed(() => filteredTasks.value.slice(0, currentPage.value * itemsPerPage))
const totalPages = computed(() => Math.ceil(filteredTasks.value.length / itemsPerPage))

function syncRoute() {
  router.replace({
    query: {
      search: searchQuery.value || undefined,
      priority: selectedPriority.value !== 'all' ? selectedPriority.value : undefined,
      status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
      page: currentPage.value > 1 ? String(currentPage.value) : undefined
    }
  })
}

const handleSearch = debounce(() => {
  currentPage.value = 1
  syncRoute()
}, 300)

function clearFilters() {
  searchQuery.value = ''
  selectedPriority.value = 'all'
  selectedStatus.value = 'all'
  currentPage.value = 1
  syncRoute()
}

function loadMore() {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true
  setTimeout(() => {
    currentPage.value++
    isLoading.value = false
    hasMore.value = currentPage.value < totalPages.value
    syncRoute()
  }, 300)
}

function handleScroll() {
  if (!scrollContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  if ((scrollTop + clientHeight) / scrollHeight > 0.9 && hasMore.value && !isLoading.value) loadMore()
}

function openNew() {
  editingTask.value = undefined
  isFormOpen.value = true
  nextTick(() => formInboxRef.value?.open())
}

function openEdit(task: InboxTask) {
  editingTask.value = task
  isFormOpen.value = true
  nextTick(() => formInboxRef.value?.open())
}

function handleSubmit(data: InboxTaskType) {
  editingTask.value ? inbox.update(editingTask.value.id, data) : inbox.create(data)
  isFormOpen.value = false
}

function handleDelete(taskId: string) {
  inbox.delete(taskId)
}

watch([searchQuery, selectedPriority, selectedStatus], handleSearch)

watch(filteredTasks, () => {
  hasMore.value = currentPage.value < totalPages.value
  nextTick(() => {
    taskElements.value.forEach((el, index) => {
      if (el && !el.style.opacity) {
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
        setTimeout(() => {
          el.style.transition = 'all 0.3s ease-out'
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }, index * 50)
      }
    })
  })
}, { deep: true })

onMounted(() => {
  scrollContainer.value?.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <main class="min-h-screen p-6 space-y-6 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold">Inbox Tasks</h1>
        <p class="text-gray-500 dark:text-gray-400">Manage your tasks efficiently</p>
      </div>
      <div class="flex gap-2">
        <button @click="isSearchMode = !isSearchMode"
          class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2">
          <Search class="w-4 h-4" />
          <span class="hidden sm:inline">{{ isSearchMode ? 'Hide' : 'Search' }}</span>
        </button>
        <button @click="openNew"
          class="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark text-white flex items-center gap-2">
          <Plus class="w-4 h-4" />
          <span class="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </header>

    <transition name="fade">
      <section v-if="isSearchMode"
        class="p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 space-y-4">
        <input v-model="searchQuery" type="text" placeholder="Search..."
          class="w-full px-4 py-2 rounded-md border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary" />
        <div class="grid sm:grid-cols-2 gap-4">
          <select v-model="selectedPriority"
            class="w-full px-3 py-2 rounded-md border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary">
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select v-model="selectedStatus"
            class="w-full px-3 py-2 rounded-md border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary">
            <option value="all">All status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <button @click="clearFilters" class="text-primary hover:underline text-sm">Clear filters</button>
      </section>
    </transition>

    <section ref="scrollContainer" class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
      <div v-if="isLoading && !displayedTasks.length">
        <div v-for="i in 3" :key="'skeleton-' + i" class="animate-pulse p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 space-y-2">
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div class="flex gap-2 mt-2">
            <div class="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div class="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>

      <template v-else-if="displayedTasks.length">
        <article v-for="(task, index) in displayedTasks" :key="task.id"
          :ref="el => { if (el) taskElements[index] = el as HTMLElement }"
          class="p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex justify-between items-start gap-4">
          <div class="flex-grow">
            <h3 class="font-semibold mb-1">{{ task.title }}</h3>
            <p v-if="task.description" class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ task.description }}</p>
            <div class="flex gap-2 text-xs">
              <span :class="{'text-green-500': task.priority==='low','text-yellow-500':task.priority==='medium','text-red-500':task.priority==='high'}">
                {{ task.priority || 'medium' }}
              </span>
              <span class="capitalize">{{ task.status }}</span>
            </div>
          </div>
          <div class="flex gap-1">
            <button @click="openEdit(task)"
              class="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <Pencil class="w-4 h-4" />
            </button>
            <button @click="handleDelete(task.id)"
              class="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </article>

        <div v-if="isLoading" class="space-y-4">
          <div v-for="i in 2" :key="'loading-more-' + i" class="animate-pulse p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 space-y-2">
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div class="flex gap-2 mt-2">
              <div class="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div class="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="text-center py-10 text-gray-500">
        No task found
      </div>
    </section>

    <FormInbox
      v-if="isFormOpen"
      ref="formInboxRef"
      :inboxUpdate="editingTask"
      @submit="handleSubmit"
      @cancel="isFormOpen = false"
    />
  </main>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar { width: 6px }
.scrollbar-thin::-webkit-scrollbar-thumb { background: #888; border-radius: 3px }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
