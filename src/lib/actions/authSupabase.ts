'use server'

import { supabase } from '@/supabaseClient'
import { Role } from '@prisma/client'
import { cookies } from 'next/headers'
import db from '../db'
import bcrypt from "bcryptjs"

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }
  if (data.user) {
    const cookieStore = await cookies()
    cookieStore.set('session', JSON.stringify(data.user))
    return { data: data.user }
  }

  return { error: 'Failed to sign in' }
}

export const signUp = async (email: string, password: string, role: Role) => {
  const userExists = await db.user.findUnique({ where: { email } })

  if (userExists) return { error: 'User already exists' }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  })

  if (error) return { error: error.message }
  if (data.user) {
    const pass = bcrypt.hashSync(password)

    const newUser = await db.user.create({
      data: {
        email,
        pass,
        role,
      }
    })

    const cookieStore = await cookies()
    cookieStore.set('session', JSON.stringify(newUser))
    return newUser
  }

  return { error: 'Failed to sign up' }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) return { error: error.message }

  const cookieStore = await cookies()
  cookieStore.delete('session')
  return { res: 200 }
}
