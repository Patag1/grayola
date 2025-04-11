'use server'

import { supabase } from '@/supabaseClient'
import { Role } from '@prisma/client'
import { cookies } from 'next/headers'
import db from '../db'
import bcrypt from 'bcryptjs'

export const signIn = async (email: string, password: string) => {
  try {
    const cookieStore = await cookies()
    if (!email || !password) return { error: 'Email and password are required' }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return { error: error.message }
    if (data.user) {
      cookieStore.set('session', JSON.stringify({ email, date: Date.now() }))
      return { data: data.user }
    }
  } catch (error) {
    return { error: 'Internal Server Error' }
  }

  return { error: 'Failed to sign in' }
}

export const signUp = async (email: string, password: string, role: Role) => {
  try {
    const cookieStore = await cookies()
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
        },
      })

      cookieStore.set('session', JSON.stringify({ email, date: Date.now() }))
      return { data: newUser }
    }
  } catch (error) {
    return { error: 'Internal Server Error' }
  }

  return { error: 'Failed to sign up' }
}

export const signOut = async () => {
  try {
    const cookieStore = await cookies()
    const { error } = await supabase.auth.signOut()

    if (error) return { error: error.message }

    cookieStore.delete('session')
    return { res: 200 }
  } catch (error) {
    return { error: 'Internal Server Error' }
  }

  return { error: 'Failed to sign out' }
}
