import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useInboxStore } from './useInbox'
import type { SubTask } from '@/interfaces'


export const useBoard = defineStore('board', () => {
  const inbox = useInboxStore()
  const selectedTaskId = ref<string>('')

  const selectedTask = computed(() =>
    inbox.tasks.find(t => t.id === selectedTaskId.value)
  )

  function addSubtask(title: string) {
    if (!selectedTask.value) return
    const newSub: SubTask = {
      id: crypto.randomUUID(),
      title,
      status: 'todo'
    }
    const updated = {
      ...selectedTask.value,
      subtasks: [...(selectedTask.value.subtasks || []), newSub]
    }
    inbox.update(selectedTask.value.id, updated)
  }

  function updateSubtaskStatus(subId: string, status: SubTask['status']) {
    if (!selectedTask.value) return
    const updatedSubtasks = selectedTask.value.subtasks?.map(s =>
      s.id === subId ? { ...s, status } : s
    )
    inbox.update(selectedTask.value.id, { subtasks: updatedSubtasks })
  }

  function updateAllSubtasks(newSubtasks: SubTask[]) {
    if (!selectedTask.value) return
    inbox.update(selectedTask.value.id, { subtasks: newSubtasks })
  }

  return {
    selectedTaskId,
    selectedTask,
    addSubtask,
    updateSubtaskStatus,
    updateAllSubtasks
  }
})
