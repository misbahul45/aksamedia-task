import { defineStore } from 'pinia'
import { useValidator } from '@/composable/useValidator'
import { ForgotPasswordSchema, LoginSchema, type ForgotPasswordSchemaType, type LoginSchemaType } from '@/schemas/auth.schema'
import { type APIResponse, type AuthState, type User } from '@/interfaces'
import { hashPw, verifyPw } from '@/utils/secure'
import { sleep } from '@/utils/lib'

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY
const SESSION_KEY = import.meta.env.VITE_SESSION_KEY

export const useAuth = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  }),

  getters: {
    isLoggedIn: state => !!state.user
  },

  actions: {
    getUsers(): User[] {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    },

    saveUsers(users: User[]) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    },
    updateUser(data: Partial<Omit<User, 'password'>>) {
      if (!this.user) return

      const users = this.getUsers()
      const idx = users.findIndex(u => u.email === this.user!.email)

      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data }
        this.saveUsers(users)
        this.setSession(users[idx])
      }
    },

    setSession(user: User) {
      const { password, ...safeUser } = user
      this.user = safeUser
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser))
    },

    async logout() {
      await sleep(1000)
      this.user = null
      localStorage.removeItem(SESSION_KEY)
    },

    async forgot(form: ForgotPasswordSchemaType): Promise<APIResponse> {
      const { validate } = useValidator()
      const result = validate(ForgotPasswordSchema, form)

      if (!result.ok) {
        return { ok: false, errors: result.errors, message: 'invalid model data' }
      }

      await sleep(1000)

      const { email, password } = result.data
      const users = this.getUsers()
      const idx = users.findIndex(u => u.email === email)

      if (idx === -1) {
        return { ok: false, message: 'User not found' }
      }

      const hashed = await hashPw(password)
      users[idx].password = hashed
      this.saveUsers(users)

      return { ok: true, message: 'Password has been reset' }
    },

    async login(form: LoginSchemaType): Promise<APIResponse<Omit<User, 'password'>>> {
      const { validate } = useValidator()
      const result = validate(LoginSchema, form)

      if (!result.ok) {
        return { ok: false, errors: result.errors, message: 'invalid model data' }
      }

      await sleep(1000)

      const { username, email, password } = result.data
      const users = this.getUsers()
      const existing = users.find(u => u.email === email)

      if (existing) {
        const match = await verifyPw(password, existing.password)
        if (!match) {
          return { ok: false, message: 'Incorrect password' }
        }

        this.setSession(existing)
        return { ok: true, data: this.user!, message: 'Success login user' }
      }

      const existUsername = users.find(u => u.username === username)
      if (existUsername) return { ok: false, message: 'should be unique name' }

      const hashed = await hashPw(password)
      const newUser: User = {
        username,
        email,
        password: hashed
      }

      users.push(newUser)
      this.saveUsers(users)
      this.setSession(newUser)

      return { ok: true, data: this.user!, message: 'Succesfully login' }
    }
  }
})