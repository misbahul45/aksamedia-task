import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' }),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' }),
})

export type ForgotPasswordSchemaType=z.infer<typeof ForgotPasswordSchema>

export type LoginSchemaType=z.infer<typeof LoginSchema>

