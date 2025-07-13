<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from '@/composable/useForm'
import Input from '@/components/ui/Input.vue'
import {
  Mail as EnvelopeIcon,
  Lock as LockClosedIcon,
} from 'lucide-vue-next'
import { ForgotPasswordSchema, type ForgotPasswordSchemaType } from '@/schemas/auth.schema'
import { useAuth } from '@/stores/useAuth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composable/useToast'

const router=useRouter()
const showPassword = ref(false)

const { forgot }=useAuth()
const { toast }=useToast()

const {
  values,
  errors,
  isSubmitting,
  onBlur,
  handleSubmit,
  reset
} = useForm(ForgotPasswordSchema, {
  email: '',
  password: '',
}, 'onChange')

const onSubmit = async (data: ForgotPasswordSchemaType) => {
  const res=await forgot(data)
  toast({
    message:res.message,
    type:res.ok?'success':'error'
  })

  if(res.ok){
    router.push('/login')
    reset()
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <form @submit.prevent="handleSubmit(onSubmit)" class="w-full max-w-xl space-y-4">

    <Input
      v-model="values.email"
      name="email"
      label="Email"
      placeholder="Input your email"
      :icon="EnvelopeIcon"
      :error="errors.email"
      required
      @blur="onBlur('email')"
    />

    <Input
      v-model="values.password"
      name="password"
      :type="showPassword ? 'text' : 'password'"
      label="Password"
      placeholder="Input your new password"
      :icon="LockClosedIcon"
      :error="errors.password"
      :show-password-toggle="true"
      :show-password="showPassword"
      required
      @blur="onBlur('password')"
      @toggle-password="togglePassword"
    />

    <button
      type="submit"
      :disabled="isSubmitting"
      class="w-full bg-primary/80 hover:bg-primary  text-white py-3 rounded-xl mt-2 font-bold cursor-pointer disabled:bg-primary/50 disabled:cursor-not-allowed"
    >
      {{ isSubmitting ? 'Submitting...' : 'Login My Friend' }}
    </button>
  </form>
</template>