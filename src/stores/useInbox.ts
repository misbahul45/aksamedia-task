import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { InboxTaskType } from '@/schemas/inbox.schema'
import type { InboxTask } from '@/interfaces'

const STORAGE_KEY = import.meta.env.VITE_INBOX_KEY as string

function loadTasks(): InboxTask[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  const parsed: InboxTask[] = raw ? JSON.parse(raw) : []
  return parsed.map(task => ({
    ...task,
    subtasks: task.subtasks || []
  }))
}

function saveTasks(tasks: InboxTask[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const useInboxStore = defineStore('inbox', () => {
  const tasks = ref<InboxTask[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function getAll() {
    loading.value = true
    try {
      tasks.value = loadTasks()
    } catch {
      error.value = 'Failed to load tasks'
    } finally {
      loading.value = false
    }
  }

  function create(data: InboxTaskType) {
    const newTask: InboxTask = {
      id: uuidv4(),
      ...data,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      subtasks: []
    }
    const current = loadTasks()
    current.push(newTask)
    saveTasks(current)
    getAll()
  }

  function update(id: string, patch: Partial<InboxTask>) {
    const current = loadTasks()
    const index = current.findIndex(t => t.id === id)
    if (index === -1) {
      error.value = 'Task not found'
      return
    }
    current[index] = {
      ...current[index],
      ...patch,
      updatedAt: new Date().toISOString()
    }
    saveTasks(current)
    getAll()
  }

  function remove(id: string) {
    const current = loadTasks()
    const filtered = current.filter(t => t.id !== id)
    saveTasks(filtered)
    getAll()
  }

  getAll()

  return { tasks, loading, error, getAll, create, update, delete: remove }
})
