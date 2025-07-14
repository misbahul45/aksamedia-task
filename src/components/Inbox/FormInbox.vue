<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue'
import type { InboxTask } from '@/interfaces'
import { InboxTaskSchema, type InboxTaskType } from '@/schemas/inbox.schema'
import { useForm } from '@/composable/useForm'
import { gsap } from 'gsap'

const props = defineProps<{ inboxUpdate?: InboxTask }>()
const emit = defineEmits<{ submit: [data: InboxTaskType]; cancel: [] }>()

const dialogRef = ref(false)
const dialogEl = ref<HTMLElement | null>(null)

const open = async () => {
  dialogRef.value = true
  await nextTick()
  if (dialogEl.value) {
    gsap.fromTo(dialogEl.value, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
  }
}
defineExpose({ open })

const isEditMode = computed(() => !!props.inboxUpdate)

const initialValues: InboxTaskType = {
  title: '',
  description: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'inbox',
  tags: [],
  priority: 'medium',
  plannerDate: ''
}

const {
  values, errors, touched, isSubmitting,
  setValue, onBlur, handleSubmit, reset
} = useForm(InboxTaskSchema, initialValues, 'onChange')

watch(
  () => props.inboxUpdate,
  task => {
    task ? reset(task) : reset()
    dialogRef.value = true
  },
  { immediate: true, deep: true }
)

const tagsString = computed({
  get: () => Array.isArray(values.value.tags) ? values.value.tags.join(', ') : '',
  set: v => setValue('tags', v.split(',').map(t => t.trim()).filter(Boolean))
})

const fmt = (d: unknown) =>
  typeof d === 'string' ? new Date(d).toISOString().slice(0, 16) : ''

const priorityOpt = ['low', 'medium', 'high']
const statusOpt = ['inbox', 'archived', 'done']

const closeDialog = () => {
  if (dialogEl.value) {
    gsap.to(dialogEl.value, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        dialogRef.value = false
        emit('cancel')
      }
    })
  } else {
    dialogRef.value = false
    emit('cancel')
  }
}

const onSubmit = (data: any) => {
  emit('submit', data as InboxTaskType)
  closeDialog()
}
</script>

<template>
  <div v-if="dialogRef" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div ref="dialogEl" class="relative w-full max-w-2xl transition-all">
      <div class="rounded-2xl shadow-2xl overflow-hidden border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/40 dark:to-gray-800/10 border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {{ isEditMode ? 'Edit Task' : 'Create New Task' }}
          </h2>
          <button @click="closeDialog" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit(onSubmit)" class="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div>
            <label class="block mb-2 text-sm font-semibold">Title <span class="text-red-500">*</span></label>
            <input
              type="text" :value="values.title"
              @input="setValue('title', ($event.target as HTMLInputElement).value)" @blur="onBlur('title')"
              class="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="errors.title && touched.title && 'border-red-500 focus:ring-red-500'"
              placeholder="Enter task title" />
            <p v-if="errors.title && touched.title" class="mt-1 text-sm text-red-500 font-medium">{{ errors.title }}</p>
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Description</label>
            <textarea
              :value="values.description"
              @input="setValue('description', ($event.target as HTMLTextAreaElement).value)"
              @blur="onBlur('description')"
              class="w-full h-28 px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
              placeholder="Enter description" />
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-2 text-sm font-semibold">Status</label>
              <select
                :value="values.status"
                @change="setValue('status', ($event.target as HTMLSelectElement).value as InboxTaskType['status'])"
                @blur="onBlur('status')"
                class="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                <option v-for="s in statusOpt" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div>
              <label class="block mb-2 text-sm font-semibold">Priority</label>
              <select
                :value="values.priority"
                @change="setValue('priority', ($event.target as HTMLSelectElement).value as InboxTaskType['priority'])"
                @blur="onBlur('priority')"
                class="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                <option value="">Select</option>
                <option v-for="p in priorityOpt" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Tags</label>
            <input
              type="text" v-model="tagsString" @blur="onBlur('tags')"
              class="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="e.g., urgent, client, bug" />
          </div>

          <div>
            <label class="block mb-2 text-sm font-semibold">Planner Date<span class="text-red-500">*</span></label>
            <input
              type="date" :value="values.plannerDate"
              @input="setValue('plannerDate', ($event.target as HTMLInputElement).value)"
              @blur="onBlur('plannerDate')"
              class="w-full px-4 py-3 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-2 text-sm font-semibold">Created At</label>
              <input
                type="datetime-local" :value="fmt(values.createdAt)" readonly
                class="w-full px-4 py-3 rounded-xl border-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
            </div>
            <div>
              <label class="block mb-2 text-sm font-semibold">Updated At</label>
              <input
                type="datetime-local" :value="fmt(values.updatedAt)" readonly
                class="w-full px-4 py-3 rounded-xl border-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button type="button" @click="closeDialog"
              class="px-5 py-3 rounded-xl font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              Cancel
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                     shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition">
              <span v-if="isSubmitting">{{ isEditMode ? 'Saving...' : 'Creating...' }}</span>
              <span v-else>{{ isEditMode ? 'Save Changes' : 'Create Task' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
