import { Separator } from '@/components/ui/separator'
import CreateProjectForm from '@/components/createProjectForm'

const page = async () => {
  return (
    <div>
      <h1 className="text-2xl mb-2">Create new project</h1>
      <p className="text-muted-foreground text-sm">
        And let our staff know what you want to build
      </p>
      <Separator className="my-4" />
      <CreateProjectForm />
    </div>
  )
}

export default page
