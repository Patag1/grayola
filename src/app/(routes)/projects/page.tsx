import db from '@/lib/db'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import DelProjectBtn from '@/components/delProjectBtn'
import Image from 'next/image'
import { getUser } from '@/lib/actions/getUser'
import { Separator } from '@/components/ui/separator'

const page = async () => {
  const user = await getUser()

  const projects = await db.project.findMany({
    include: {
      creator: true,
      assignee: true,
    },
  })

  return (
    <div className="flex justify-center items-center flex-col">
      {projects.length ? (
        projects.map((p, i) => (
          <Card key={i} className="max-w-prose">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="uppercase">{p.title}</CardTitle>
              {user && user.role === 'pm' && (
                <div className="flex items-center gap-x-2">
                  <Link href={`/projects/${p.id}`}>
                    <Button type="button" variant='outline'>
                      <Pencil />
                    </Button>
                  </Link>
                  <DelProjectBtn projectId={p.id} />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[1fr_auto] gap-x-2">
                <p className="columns-2">{p.desc}</p>
                <div className="flex flex-col gap-y-2">
                  {p.files.map((f, i) => (
                    <Image
                      key={i}
                      src={f}
                      alt="f"
                      width={64}
                      height={64}
                      className="aspect-square overflow-hidden border rounded-full"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex items-center gap-x-2 text-sm">
              <div className="flex flex-col">
                <p>Creator: {p.creator.email.split('@')[0]}</p>
                <p className="text-muted-foreground">
                  contact: {p.creator.email}
                </p>
              </div>
              {p.assignee && (
                <>
                  <div className="h-full border-l-2" />
                  <div className="flex flex-col">
                    <p>Designer: {p.assignee.email.split('@')[0]}</p>
                    <p className="text-sm text-muted-foreground">
                      contact: {p.assignee.email}
                    </p>
                  </div>
                </>
              )}
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>No data yet</p>
      )}
    </div>
  )
}

export default page
