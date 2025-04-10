import db from '@/lib/db'
import Navbar from '@/components/navbar'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { supabase } from '@/supabaseClient'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, Pencil } from 'lucide-react'
import DelProjectBtn from '@/components/delProjectBtn'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Image from 'next/image'

const page = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) redirect('/signin')

  const role = data.user.role

  const projects = await db.project.findMany({
    include: {
      creator: true,
      assignee: true,
    },
  })

  return (
    <>
      <Navbar />
      <div>
        {projects.length ? (
          projects.map((p, i) => (
            <Card key={i}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{p.title}</CardTitle>
                <div className="flex items-center gap-x-2">
                  <Dialog>
                    <DialogTrigger>
                      <Button type="button" className="cursor-pointer">
                        <Eye />
                      </Button>
                    </DialogTrigger>
                    <DialogHeader>
                      <DialogTitle>{p.title}</DialogTitle>
                      <DialogDescription className="space-x-2">
                        <div>
                          <p>Client: {p.creator.email.split('@')[0]}</p>
                          <p>contact: {p.creator.email}</p>
                        </div>
                        {p.assignee && (
                          <div>
                            <p>Designer: {p.assignee.email.split('@')[0]}</p>
                            <p>contact: {p.assignee.email}</p>
                          </div>
                        )}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogContent>
                      <p>{p.desc}</p>
                    </DialogContent>
                    <DialogFooter className="space-x-2">
                      {p.files.map((file, i) => (
                        <Image
                          key={i}
                          src={file}
                          alt={file}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ))}
                    </DialogFooter>
                  </Dialog>
                  {role === 'pm' && (
                    <>
                      <Link href={`/projects/${p.id}`}>
                        <Button type="button">
                          <Pencil />
                        </Button>
                      </Link>
                      <DelProjectBtn projectId={p.id} />
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3">
                  <p className="columns-2">{p.desc}</p>
                  <div className="flex flex-col">
                    {p.files.map((f, i) => (
                      <div key={i}>{f}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center gap-x-2">
                <div className="flex flex-col">
                  <p>Creator: {p.creator.email.split('@')[0]}</p>
                  <p className="text-sm text-muted-foreground">
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
    </>
  )
}

export default page
