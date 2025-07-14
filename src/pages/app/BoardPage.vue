<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import draggable from 'vuedraggable'
import gsap from 'gsap'
import { useInboxStore } from '@/stores/useInbox'
import { useBoard } from '@/stores/useBoard'
import type { SubTask } from '@/interfaces'

interface DraggableChangeEvent {
  added?: { element: SubTask; newIndex: number };
}

const inbox = useInboxStore()
const board = useBoard()
const newSub = ref('')
const boardContainer = ref<HTMLElement | null>(null)
const drag = ref(false)
const hasAnimatedColumns = ref(false)

onBeforeRouteLeave(() => {
  board.selectedTaskId = ''
})

const getSubtasksByStatus = (status: SubTask['status']) => {
  return computed(() => board.selectedTask?.subtasks?.filter(s => s.status === status) || [])
}

const columns = computed(() => [
  { title: '📝 Todo', status: 'todo' as const, list: getSubtasksByStatus('todo') },
  { title: '⚙️ In Progress', status: 'in-progress' as const, list: getSubtasksByStatus('in-progress') },
  { title: '✅ Done', status: 'done' as const, list: getSubtasksByStatus('done') }
])

const handleChange = (event: DraggableChangeEvent, newStatus: SubTask['status']) => {
  if (event.added) {
    board.updateSubtaskStatus(event.added.element.id, newStatus)
  }
}

watch(() => board.selectedTask, (newTask) => {
  if (newTask && boardContainer.value && !hasAnimatedColumns.value) {
    hasAnimatedColumns.value = true
    nextTick(() => {
      gsap.from(boardContainer.value!.children, {
        duration: 0.6,
        opacity: 0,
        y: 40,
        stagger: 0.1,
        ease: 'power3.out',
      })
    })
  }
})

const onEnter = (el: Element, done: () => void) => {
  gsap.from(el, {
    opacity: 0,
    scale: 0.5,
    duration: 0.4,
    ease: 'power3.out',
    onComplete: done
  })
}

const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 0,
    scale: 0.5,
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done
  })
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto min-h-screen bg-zinc-100 dark:bg-zinc-950">
    <h1 class="text-3xl font-extrabold mb-8 text-primary">🧩 Task Board</h1>

    <div class="mb-6">
      <label class="block font-medium text-zinc-700 dark:text-zinc-100 mb-2">
        Select Inbox Task
      </label>
      <select
        v-model="board.selectedTaskId"
        class="w-full border-zinc-300 dark:border-zinc-700 rounded px-4 py-2 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition"
      >
        <option disabled value="">-- Select Task --</option>
        <option v-for="task in inbox.tasks" :key="task.id" :value="task.id">
          {{ task.title }}
        </option>
      </select>
    </div>

    <div
      v-if="board.selectedTask"
      ref="boardContainer"
      class="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all"
    >
      <div 
        v-for="column in columns" 
        :key="column.status" 
        class="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4 min-h-[200px] flex flex-col"
      >
        <h2 class="text-lg font-semibold mb-3 text-zinc-800 dark:text-white">{{ column.title }}</h2>
        <draggable
          :list="column.list.value"
          group="subtasks"
          item-key="id"
          class="space-y-2 flex-grow"
          :component-data="{
            tag: 'ul',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null
          }"
          :animation="200"
          @start="drag = true"
          @end="drag = false"
          @change="handleChange($event, column.status)"
          @enter="onEnter"
          @leave="onLeave"
          :css="false"
        >
          <template #item="{ element }">
            <li class="p-3 bg-zinc-50 dark:bg-zinc-800 border-l-4 rounded cursor-move subtask-item"
                :class="{ 
                  'border-yellow-400': element.status === 'todo',
                  'border-blue-400': element.status === 'in-progress',
                  'border-green-400': element.status === 'done',
                  'line-through text-zinc-500': element.status === 'done'
                }"
            >
              <p class="text-sm font-medium">{{ element.title }}</p>
              <div v-if="element.status !== 'done'" class="flex gap-4 text-xs mt-2">
                <button
                  v-if="element.status === 'todo'"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                  @click.stop="board.updateSubtaskStatus(element.id, 'in-progress')"
                > → In Progress </button>
                <template v-if="element.status === 'in-progress'">
                  <button
                    class="text-yellow-600 dark:text-yellow-400 hover:underline"
                    @click.stop="board.updateSubtaskStatus(element.id, 'todo')"
                  > ← Todo </button>
                  <button
                    class="text-green-600 dark:text-green-400 hover:underline"
                    @click.stop="board.updateSubtaskStatus(element.id, 'done')"
                  > → Done </button>
                </template>
              </div>
               <div v-else class="flex gap-4 text-xs mt-2">
                 <button
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                  @click.stop="board.updateSubtaskStatus(element.id, 'in-progress')"
                > ← Un-complete </button>
               </div>
            </li>
          </template>
        </draggable>
        <div v-if="column.list.value.length === 0" class="text-zinc-400 text-sm mt-2 text-center pt-4">Drag subtasks here.</div>
      </div>
    </div>

    <div v-if="board.selectedTask" class="mt-6">
      <div class="max-w-md bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md">
        <h3 class="font-semibold mb-2 text-zinc-800 dark:text-white">Add a new subtask</h3>
        <div class="flex gap-2">
          <input
            v-model="newSub"
            placeholder="e.g., Design the login page"
            class="flex-1 px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition"
            @keyup.enter="board.addSubtask(newSub); newSub = ''"
          />
          <button
            @click="board.addSubtask(newSub); newSub = ''"
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors font-semibold"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-primary {
  background-color: #4F46E5;
}
.text-primary {
  color: #4F46E5;
}
.focus\:ring-primary:focus {
  --tw-ring-color: #4F46E5;
}
.focus\:border-primary:focus {
  border-color: #4F46E5;
}

.sortable-ghost {
  opacity: 0.4;
  background: #c8ebfb;
  border-radius: 0.25rem;
}

.sortable-drag {
  opacity: 1 !important;
  transform: rotate(2deg) scale(1.05);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.flip-list-move {
  transition: transform 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>