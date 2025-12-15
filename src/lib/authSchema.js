import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

export const registerSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm password is required' }),
    phone: z.string().min(6, { message: 'Phone is required' }),
    dob: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), { message: 'Date of birth must be YYYY-MM-DD' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

export default { loginSchema, registerSchema }
