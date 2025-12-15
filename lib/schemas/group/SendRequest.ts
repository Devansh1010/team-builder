import { z } from 'zod'

export const joinGroupSchema = z.object({
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(300, 'Message must be less than 300 characters')
    .trim(),
})

export type JoinGroupSchema = z.infer<typeof joinGroupSchema>
