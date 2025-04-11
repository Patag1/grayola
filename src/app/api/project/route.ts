import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/actions/getUser'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    // const user = await getUser()

    // console.log(user)
    
    const { title, desc, files, user } = await req.json()
    
    if (!user || user.role !== 'client') {
      //   console.log('[PROJECT_ID:PATCH:401]: ', session.error) // debugging
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
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
