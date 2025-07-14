<template>
  <div class="kanban-card p-4 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg shadow-sm flex justify-between items-center cursor-grab active:cursor-grabbing">
    <p class="flex-1 mr-4 text-sm text-gray-800 dark:text-gray-200">{{ title }}</p>
    <div class="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>