<script lang="ts" setup>
import { Eye as EyeIcon, EyeOff as EyeSlashIcon } from 'lucide-vue-next'


const props = defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
  name?: string 
  icon?: any
  label?: string
  required?: boolean
  error?: string
  showPasswordToggle?: boolean
  showPassword?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'toggle-password'])

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function togglePassword() {
  emit('toggle-password')
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center">
        <label
            v-if="props.label"
            :for="props.name"
            class="block mb-2 text-base font-medium dark:text-gray-400 text-gray-900"
            >
            {{ props.label }}
            <span v-if="props.required" class="dark:text-red-800 text-red-500">*</span>
        </label>
        <router-link v-if="name?.includes('password') && !placeholder?.includes('new')" class="text-xs text-primary hover:text-primary/80" to="/forgot-password">
            forgot password?
        </router-link>
    </div>

    <div class="relative w-full">
      <span
        v-if="props.icon"
        class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"
      >
        <component :is="props.icon" class="h-5 w-5" />
      </span>

      <input
        :id="props.name"
        :type="props.type || 'text'"
        :placeholder="props.placeholder"
        :required="props.required"
        :class="[ 
          'w-full py-3 bg-gray-100 dark:bg-gray-800 rounded-lg ring ring-primary/30 focus:outline-none focus:ring-2 focus:ring-primary',
          props.icon ? 'pl-10' : 'pl-4',
          props.showPasswordToggle ? 'pr-10' : 'pr-4'
        ]"
        :value="props.modelValue"
        @input="handleInput"
      />

      <button
        v-if="props.showPasswordToggle"
        type="button"
        @click="togglePassword"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <EyeIcon v-if="!props.showPassword" class="h-5 w-5" />
        <EyeSlashIcon v-else class="h-5 w-5" />
      </button>
    </div>
    
    <p v-if="props.error" class="mt-1 text-sm text-red-500">{{ props.error }}</p>
  </div>
</template>
