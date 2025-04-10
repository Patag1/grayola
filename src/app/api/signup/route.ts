import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { ROLES } from '@/components/signUpForm'

export default async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json()

    if (
      !email.test(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ||
      password.lenght > 8 ||
      !ROLES.includes(role)
    ) {
      //   console.log('[PROJECT_ID:PATCH:400]: Invalid request body') // debugging
      return new NextResponse('Bad Request', { status: 400 })
    }

    const user = await db.user.create({
      data: {
        email,
        pass: password,
        role,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    // console.log('[PROJECT_ID:PATCH:500]: ', error) // debugging
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
