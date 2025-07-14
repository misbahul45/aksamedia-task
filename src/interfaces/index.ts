export interface User {
  username: string
  email: string
  password: string        
  bio?: string
}

export interface AuthState {
  user: Omit<User, 'password'> | null
}


export interface APIResponseSuccess<T = undefined> {
  ok: true
  data?: T,
  message:string
}

export interface APIResponseError {
  ok: false
  message: string
  errors?: Record<string, string>
}

export type APIResponse<T = undefined> =
  | APIResponseSuccess<T>
  | APIResponseError


export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string> }

export type Web_Theme='light' | 'dark' | 'system'


export interface SubTask {
  id: string
  title: string
  status: 'todo' | 'in-progress' | 'done'
}

export interface InboxTask {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt?: string
  status: 'inbox' | 'archived' | 'done'
  tags?: string[]
  priority?: 'low' | 'medium' | 'high'
  boardId?: string
  plannerDate?: string
  subtasks?: SubTask[]
}