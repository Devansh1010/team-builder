import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters"),
  limit: z
    .number()
    .int("Limit must be an number")
    .min(1, "Limit must be at least 1")
    .max(10, "Limit is too large"),
  file: z
    .instanceof(FileList, { message: "Please select a file" })
});

export type FormValues = z.infer<typeof formSchema>;