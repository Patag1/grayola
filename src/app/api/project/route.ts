import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/supabaseClient'
import db from '@/lib/db'

export default async function POST(req: NextRequest) {
  try {
    const session = await supabase.auth.getSession()
    const user = session.data.session?.user
    const role = user?.role

    if (session.error?.code || !user || !role || role !== 'client') {
      //   console.log('[PROJECT_ID:PATCH:401]: ', session.error) // debugging
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { title, desc, files } = await req.json()

    if (!title || title.lenght > 50 || !desc || desc.length > 500) {
      //   console.log('[PROJECT_ID:PATCH:400]: Invalid request body') // debugging
      return new NextResponse('Bad Request', { status: 400 })
    }

    // TODO

    const project = await db.project.create({
      data: {
        title,
        desc,
        files,
        creatorId: user.id,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    // console.log('[PROJECT_ID:PATCH:500]: ', error) // debugging
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
