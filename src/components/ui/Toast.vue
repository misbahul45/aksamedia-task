<script setup lang="ts">
import { useToast } from '@/composable/useToast'
import { computed, ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  position?: 'top-left' | 'top-center' | 'top-right'
}>()

const toast = useToast()
const toastRef = ref<HTMLElement | null>(null)
const visible = ref(false)

const positionClass = computed(() => {
  switch (props.position) {
    case 'top-left': return 'top-4 left-4'
    case 'top-center': return 'top-4 left-1/2 transform -translate-x-1/2'
    case 'top-right':
    default: return 'top-4 right-4'
  }
})

watch(() => toast.showToast.value, async (newVal) => {
  if (newVal) {
    visible.value = true
    await nextTick()
    if (toastRef.value) {
      gsap.fromTo(toastRef.value,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  } else {
    if (toastRef.value) {
      gsap.to(toastRef.value, {
        opacity: 0,
        y: -10,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          visible.value = false 
        }
      })
    } else {
      visible.value = false
    }
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="toastRef"
      :class="[
        'fixed z-50 px-4 py-3 rounded-lg border bg-white text-black dark:bg-zinc-800 dark:text-white shadow-lg text-sm min-w-[250px] max-w-sm flex items-center justify-between gap-3',
        toast.toastEl.col,
        positionClass
      ]"
    >
      <span class="flex-1">{{ toast.toastEl.message }}</span>
      <button @click="toast.hideToast" class="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
        <X class="w-4 h-4" />
      </button>
    </div>
  </Teleport>
</template>
