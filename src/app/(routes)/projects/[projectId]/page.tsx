import { FC } from 'react'
import db from '@/lib/db'
import { redirect } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import EditProjectForm from '@/components/editProjectForm'

interface pageProps {
  params: { projectId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { projectId } = params

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      creator: true,
      assignee: true,
    },
  })

  const designers = await db.user.findMany({
    where: { role: 'designer' },
  })

  if (!project) redirect('/projects')

  return (
    <>
      <h1>Edit project: {project?.title}</h1>
      <Separator className="my-4" />
      <EditProjectForm project={project} designers={designers} />
    </>
  )
}

export default page
