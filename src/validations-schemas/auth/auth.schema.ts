import { z } from 'zod'


export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
// Password policy (kept identical to the backend registerUserSchema so a
// value that passes here can never be rejected server-side, and vice-versa).
// Login intentionally stays lenient so existing weaker passwords still work.
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must include an uppercase letter')
  .regex(/[a-z]/, 'Must include a lowercase letter')
  .regex(/[0-9]/, 'Must include a number')

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms & Conditions' }),
  }),
})

export type LoginFormData = z.infer<typeof LoginSchema>
export type RegisterFormData = z.infer<typeof RegisterSchema>
