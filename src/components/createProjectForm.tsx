'use client'

import { FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import ImageUpload from '@/components/imageUpload'
import { User } from '@prisma/client'

interface CreateProjectFormProps {
  user: User | null
}

const formSchema = z.object({
  title: z.string().min(5).max(50),
  desc: z.string().min(10).max(500),
  files: z.object({ url: z.string() }).array(),
})

type CreateProjectFormValues = z.infer<typeof formSchema>

const CreateProjectForm: FC<CreateProjectFormProps> = ({ user }) => {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      desc: '',
      files: [],
    },
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = form

  const onSubmitPut = async (data: CreateProjectFormValues) => {
    setLoading(true)

    try {
      const res = await axios.post('/project', { ...data, user })
      if (res.status === 200) {
        toast.success('Project created successfully', {
          description: 'Standby until our staff takes a look at your project',
        })
        reset({ title: '', desc: '' })
        setLoading(false)
        router.refresh()
      } else {
        toast.error('Something went wrong', {
          description: 'Failed to create project. Try creating it again later',
        })
      }
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'Failed to create project. Try creating it again later',
      })
    }

    setLoading(false)
  }

  const descChars = watch('desc').length ?? 0

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmitPut)} className="space-y-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input
                  {...register('title')}
                  placeholder="E-commerce"
                  disabled={loading}
                  required
                  className={`w-64 ${errors.title && 'outline-red-500'}`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="desc">Description</FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    {...register('desc')}
                    placeholder="Describe your project to our staff"
                    disabled={loading}
                    required
                    className={`w-96 h-32 ${errors.title && 'outline-red-500'}`}
                    maxLength={500}
                    {...field}
                  />
                  <span
                    className={`absolute bottom-0.5 left-0.5 text-muted-foreground text-xs transition-colors font-mono tabular-nums px-0.5 bg-white/50 rounded-4xl pointer-events-none ${
                      descChars >= 500 && 'text-red-500'
                    }`}
                  >
                    {descChars}/500
                  </span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="files">Images</FormLabel>
              <FormControl>
                <ImageUpload
                  {...register('files')}
                  value={field.value.map((img: { url: string }) => img.url)}
                  disabled={loading}
                  onChange={(url) => field.onChange([...field.value, { url }])}
                  onRemove={(url) =>
                    field.onChange([
                      ...field.value.filter(
                        (img: { url: string }) => img.url !== url
                      ),
                    ])
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          Create
        </Button>
      </form>
    </Form>
  )
}

export default CreateProjectForm
