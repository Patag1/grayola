'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { signOut } from '@/lib/actions/authSupabase'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const signOutBtn = () => {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSignOut = async () => {
    setLoading(true)

    try {
      const res = await signOut()
      if (res.res === 200) {
        toast.success('Signed out')
      } else {
        toast.error('Failed to sign out', {
          description: res.error,
        })
      }
    } catch (error) {
      toast.error('Failed to sign out', {
        description: 'Something went wrong. Please try again later',
      })
    }

    setLoading(false)
    router.push('/')
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={handleSignOut}
    >
      Sign out
    </Button>
  )
}

export default signOutBtn
