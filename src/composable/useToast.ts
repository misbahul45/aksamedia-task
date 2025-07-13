import { ref, reactive } from 'vue'

type ToastType = 'success' | 'error' | 'info'

const showToast = ref(false)
const toastEl = reactive({
  message: '',
  type: 'info' as ToastType,
  col: 'border-yellow-600',
})

let timeoutId: ReturnType<typeof setTimeout> | null = null

function toast({ message, type }: { message: string; type: ToastType }) {
  if (timeoutId) clearTimeout(timeoutId)

  toastEl.message = message
  toastEl.type = type
  toastEl.col =
    type === 'success'
      ? 'border-green-600'
      : type === 'error'
      ? 'border-red-600'
      : 'border-yellow-600'

  showToast.value = true

  timeoutId = setTimeout(() => {
    showToast.value = false
  }, 3000)
}

function hideToast() {
  if (timeoutId) clearTimeout(timeoutId)
  showToast.value = false
}

export function useToast() {
  return {
    showToast,
    toastEl,
    toast,
    hideToast,
  }
}
