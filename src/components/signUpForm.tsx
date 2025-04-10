'use client'

import { FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { signUp } from '@/lib/actions/authSupabase'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import Link from 'next/link'

interface SignUpFormProps {}

export const ROLES = ['client', 'pm', 'designer'] as const

const roles = ROLES.map((r) => ({
  value: r,
  label: r === 'pm' ? 'Project Manager' : r[0].toUpperCase() + r.slice(1),
}))

const formSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  pass: z.string().min(8),
  role: z.enum(ROLES),
})

type signInFormValues = z.infer<typeof formSchema>

const SignUpForm: FC<SignUpFormProps> = ({}) => {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const form = useForm<signInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      pass: '',
      role: 'client',
    },
  })

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = async (data: signInFormValues) => {
    const { email, pass, role } = data

    if (errors.email) {
      toast.error('Something went wrong', {
        description: errors.email.message,
      })
    }

    if (errors.pass) {
      toast.error('Something went wrong', {
        description: errors.pass.message,
      })
    }

    if (errors.role) {
      toast.error('Something went wrong', {
        description: errors.role.message,
      })
    }

    setLoading(true)

    try {
      const user = await signUp(email, pass, role)
      if (user) {
        toast.success('Sign up successful', {
          description: "Welcome to Augusto's Grayola Test Assessment",
        })
        reset({ email: '', pass: '', role: 'client' })
        router.push('/projects')
      } else {
        toast.error('Something went wrong', {
          description: 'Try logging in again later',
        })
      }
    } catch (_error) {
      toast.error('Something went wrong', {
        description: 'Try logging in again later',
      })
    }

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          {...register('email')}
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  disabled={loading}
                  required
                  className={`w-64 ${errors.email && 'outline-red-500'}`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          {...register('pass')}
          control={control}
          name="pass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  disabled={loading}
                  required
                  className={`w-64 ${errors.pass && 'outline-red-500'}`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          {...register('role')}
          control={control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl className={errors.role && 'outline-red-500'}>
                <Select disabled={loading} required {...field}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Account role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Role</SelectLabel>
                      {roles.map((role, i) => (
                        <SelectItem key={i} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="pt-2 flex items-center justify-between">
          <Button type="submit" disabled={loading} className="cursor-pointer">
            Sign up
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="hover:text-black hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}

export default SignUpForm
