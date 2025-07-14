<template>
  <div class="kanban-column flex flex-col bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-4">
    <h3 class="font-semibold text-gray-800 dark:text-gray-200 px-2 pb-3 mb-3 border-b-2" :class="borderColor">
      {{ title }}
      <span class="text-sm font-normal text-gray-400 dark:text-gray-500 ml-2">{{ count }}</span>
    </h3>
    <div class="flex-grow min-h-[200px] space-y-3">
      <slot name="draggable"></slot>
    </div>
    <div class="mt-4">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  count: number
  borderColor: string
}>()
</script>