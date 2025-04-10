'use client'

import { FC, useState } from 'react'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface DelProjectBtnProps {
  projectId: string
}

const DelProjectBtn: FC<DelProjectBtnProps> = ({ projectId }) => {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleDel = async () => {
    setLoading(true)

    try {
      const res = await axios.delete(`/api/project/${projectId}`)
      if (res.status === 200) {
        toast.success('Project deleted successfully')
        setLoading(false)
        router.refresh()
      } else {
        toast.success('Something went wrong', {
          description: 'Please try again later',
        })
      }
    } catch (error) {
      toast.success('Something went wrong', {
        description: 'Please try again later',
      })
    }

    setLoading(false)
  }

  return (
    <Button
      type="button"
      onClick={handleDel}
      disabled={loading}
      variant="destructive"
    >
      <Trash className="text-white" />
    </Button>
  )
}

export default DelProjectBtn
