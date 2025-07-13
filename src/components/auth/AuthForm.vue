<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from '@/composable/useForm'
import Input from '@/components/ui/Input.vue'
import {
  User as UserIcon,
  Mail as EnvelopeIcon,
  Lock as LockClosedIcon,
} from 'lucide-vue-next'
import { LoginSchema, type LoginSchemaType } from '@/schemas/auth.schema'
import { useAuth } from '@/stores/useAuth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composable/useToast'

const router=useRouter()
const showPassword = ref(false)

const { login }=useAuth()
const { toast }=useToast()

const {
  values,
  errors,
  isSubmitting,
  onBlur,
  handleSubmit,
  reset
} = useForm(LoginSchema, {
  username: '',
  email: '',
  password: '',
}, 'onChange')

const onSubmit = async (data: LoginSchemaType) => {
  const res=await login(data)
  toast({
    message:res.message,
    type:res.ok?'success':'error'
  })

  if(res.ok){
    router.push('/app/inbox')
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
      v-model="values.username"
      name="name"
      label="Name"
      placeholder="Input your account name"
      :icon="UserIcon"
      :error="errors.username"
      required
      @blur="onBlur('username')"
    />

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
      placeholder="Input your password"
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