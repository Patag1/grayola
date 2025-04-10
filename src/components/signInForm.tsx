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
import { signIn } from '@/lib/actions/authSupabase'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import Link from 'next/link'

interface SignInFormProps {}

const formSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  pass: z.string().min(8),
})

type signInFormValues = z.infer<typeof formSchema>

const SignInForm: FC<SignInFormProps> = ({}) => {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const form = useForm<signInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      pass: '',
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
    const { email, pass } = data

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

    setLoading(true)

    try {
      const res = await signIn(email, pass)
      if (res.data) {
        toast.success('Log in successful', {
          description: "Welcome to Augusto's Grayola Test Assessment",
        })
        reset({ email: '', pass: '' })
        router.push('/projects')
      } else {
        toast.error('Something went wrong', {
          description: res.error,
        })
      }
    } catch (error) {
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
              <FormLabel htmlFor="email">Email</FormLabel>
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
        <div className="pt-2 flex items-center justify-between">
          <Button type="submit" disabled={loading} className="cursor-pointer">
            Sign in
          </Button>
          <p className="text-sm text-muted-foreground">
            Don't have an account yet?{' '}
            <Link
              href="/signup"
              className="hover:text-black hover:underline transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}

export default SignInForm
