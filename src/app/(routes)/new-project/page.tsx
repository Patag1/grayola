import { Separator } from '@/components/ui/separator'
import CreateProjectForm from '@/components/createProjectForm'

const page = async () => {
  return (
    <>
      <h1>Create new project</h1>
      <Separator className='my-4' />
      <CreateProjectForm />
    </>
  )
}

export default page
