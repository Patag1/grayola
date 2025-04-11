'use server'

import db from '../db'
import { cookies } from 'next/headers'

export const getUser = async () => {
  try {
    const cookieString = (await cookies()).get('session')?.value
    const email = cookieString ? JSON.parse(cookieString).email : null
    const user = await db.user.findUnique({ where: { email } })
    return user
  } catch (error) {
    return null
  }
}
