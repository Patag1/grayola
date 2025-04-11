import { Separator } from '@/components/ui/separator'
import CreateProjectForm from '@/components/createProjectForm'
import { getUser } from '@/lib/actions/getUser'

const page = async () => {
  const user = await getUser()
  
  return (
    <div>
      <h1 className="text-2xl mb-2">Create new project</h1>
      <p className="text-muted-foreground text-sm">
        And let our staff know what you want to build
      </p>
      <Separator className="my-4" />
      <CreateProjectForm user={user} />
    </div>
  )
}

export default page
