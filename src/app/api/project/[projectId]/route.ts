import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/supabaseClient'
import db from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await supabase.auth.getSession()
    const user = session.data.session?.user
    const { projectId } = params

    if (session.error || !user|| user.role !== 'pm' || !projectId) {
      // console.log('[PROJECT_ID:PUT:401]: ', session.error) // debugging
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { title, desc, files } = await req.json()

    const project = await db.project.update({
      where: { id: projectId },
      data: {
        title,
        desc,
        files: files ?? [],
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    // console.log('[PROJECT_ID:PUT:500]: ', error) // debugging
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await supabase.auth.getSession()
    const user = session.data.session?.user
    const { projectId } = params

    if (session.error?.code || !user || user.role !== 'pm' || !projectId) {
      // console.log('[PROJECT_ID:DELETE:401]: ', session.error) // debugging
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await req.json()

    const project = await db.project.delete({ where: { id } })

    return NextResponse.json(project)
  } catch (error) {
    // console.log('[PROJECT_ID:DELETE:500]: ', error) // debugging
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
