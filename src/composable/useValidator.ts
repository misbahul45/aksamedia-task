import type { ZodSchema, ZodIssue } from "zod"
import type { ValidationResult } from "../interfaces"


export function useValidator() {
  function validate<T>(
    schema: ZodSchema<T>,
    data: unknown
  ): ValidationResult<T> {
    const result = schema.safeParse(data)

    if (result.success) {
      return { ok: true, data: result.data }
    }

    const errors: Record<string, string> = {}
    result.error.issues.forEach((err: ZodIssue) => {
      const field = err.path.join('.') || 'form'
      errors[field] = err.message
    })

    return { ok: false, errors }
  }

  return { validate }
}
