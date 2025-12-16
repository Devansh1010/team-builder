import { z } from 'zod'

export const groupSchema = z.object({
  name: z.string().min(2, 'Minimum 2 Character required in Group Name'),

  desc: z.string().optional(),

  techStack: z.array(z.string()).min(1, 'At least one tech stack is required'),
})
