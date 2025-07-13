import { reactive, toRefs, watch } from 'vue'
import type { WatchStopHandle } from 'vue'
import { ZodError, ZodObject, type z } from 'zod'

type Mode = 'onSubmit' | 'onBlur' | 'onChange'

export function useForm<T extends z.ZodRawShape>(
  schema: ZodObject<T>,
  initial: z.infer<ZodObject<T>>,
  mode: Mode = 'onSubmit'
) {
  type FormValues = z.infer<ZodObject<T>>
  type FormErrors = Partial<Record<keyof FormValues, string>>
  type FormTouched = Partial<Record<keyof FormValues, boolean>>

  const plainState = {
    values: { ...initial },
    errors: {} as FormErrors,
    touched: {} as FormTouched,
    isSubmitting: false
  }

  const state = reactive(plainState)

  let stopWatcher: WatchStopHandle | null = null

  if (mode === 'onChange') {
    stopWatcher = watch(
      () => state.values,
      () => validateCurrent(),
      { deep: true }
    )
  }

  function setValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    // Type assertion to work around Vue's reactive type wrapping
    (state.values as FormValues)[key] = value
    delete (state.errors as FormErrors)[key]

    if (mode === 'onBlur' && (state.touched as FormTouched)[key]) {
      validateField(key)
    }
  }

  function onBlur<K extends keyof FormValues>(key: K) {
    (state.touched as FormTouched)[key] = true
    if (mode === 'onBlur') {
      validateField(key)
    }
  }

    function reset(newInitial?: FormValues) {
        const source = newInitial ?? initial

        Object.assign(state.values as Record<string, any>, { ...source })

        for (const key of Object.keys(state.errors as Record<string, any>)) {
            delete (state.errors as Record<string, any>)[key]
        }

        for (const key of Object.keys(state.touched as Record<string, any>)) {
            delete (state.touched as Record<string, any>)[key]
        }

        state.isSubmitting = false
    }


  function validateField<K extends keyof FormValues>(key: K) {
    try {
      const fieldSchema = schema.shape[key as string] as z.ZodType
      fieldSchema.parse((state.values as FormValues)[key])
      delete (state.errors as FormErrors)[key]
    } catch (err) {
      if (err instanceof ZodError) {
        (state.errors as FormErrors)[key] = err.issues[0]?.message || 'Invalid'
      }
    }
  }

  function validateCurrent() {
    try {
      schema.parse(state.values)
      // Clear all errors by creating a new object
      Object.keys(state.errors as Record<string, unknown>).forEach(key => {
        delete (state.errors as FormErrors)[key as keyof FormValues]
      })
    } catch (err) {
      if (err instanceof ZodError) {
        // Clear existing errors first
        Object.keys(state.errors as Record<string, unknown>).forEach(key => {
          delete (state.errors as FormErrors)[key as keyof FormValues]
        })
        
        for (const issue of err.issues) {
          const key = issue.path[0] as keyof FormValues
          (state.errors as FormErrors)[key] = issue.message
        }
      }
    }
  }

  async function handleSubmit(cb: (data: FormValues) => Promise<void> | void) {
    if (mode === 'onSubmit') validateCurrent()
    
    const hasErrors = Object.keys(state.errors as Record<string, unknown>).length > 0
    if (hasErrors) return

    state.isSubmitting = true
    try {
      const data = schema.parse(state.values)
      await cb(data)
    } finally {
      state.isSubmitting = false
    }
  }

  return {
    ...toRefs(state),
    setValue,
    onBlur,
    handleSubmit,
    stopValidationWatcher() {
      stopWatcher?.()
    },
    reset
  }
}