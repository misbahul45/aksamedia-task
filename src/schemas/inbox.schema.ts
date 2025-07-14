import { z } from 'zod'

export const InboxTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  status: z.enum(['inbox', 'archived', 'done']),
  tags: z.array(z.string()).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  plannerDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
})

export type InboxTaskType = z.infer<typeof InboxTaskSchema>
