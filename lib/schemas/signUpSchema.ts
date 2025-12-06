import { z } from 'zod'

export const userValidation = z
  .string()
  .min(2, { message: "Minimum 2 characters required in Username" })
  .max(20, { message: "Max 20 characters allowed in the Username" })
  .regex(/^[a-zA-Z0-9_]+$/, { message: "Special characters are not allowed" })

export const emailValidation = z
  .string()
  .email({ message: "Enter valid Email Address" })

export const passwordValidation = z
  .string()
  .min(6, { message: "Password must contain at least 6 characters" })

export const fnameValidation = z
  .string()
  .min(2, { message: "First name must contain at least 2 characters" })
  .max(30, { message: "First name cannot exceed 30 characters" })
  .regex(/^[a-zA-Z]+$/, { message: "First name can only contain letters" })

export const lnameValidation = z
  .string()
  .min(2, { message: "Last name must contain at least 2 characters" })
  .max(30, { message: "Last name cannot exceed 30 characters" })
  .regex(/^[a-zA-Z]+$/, { message: "Last name can only contain letters" })

export const signUpSchema = z.object({
  username: userValidation,
  email: emailValidation,
  password: passwordValidation,
  fname: fnameValidation,
  lname: lnameValidation,
})