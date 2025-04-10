import { BriefcaseBusiness } from 'lucide-react'
import Link from 'next/link'
import SignOutBtn from './signOutBtn'
import { supabase } from '@/supabaseClient'
import { redirect } from 'next/navigation'
import { Button } from './ui/button'

const navbar = async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error) redirect('/signin')

  const role = data.session?.user.role

  return (
    <nav
      className="
      fixed 
      top-0
      left-0
      w-full
      py-4
      px-6
      border-b
      bg-white
      flex
      items-center
      justify-between
    "
    >
      <Link href="/projects" className="flex items-center gap-x-2">
        <BriefcaseBusiness />
        <h2 className="text-2xl font-bold">Augusto GTA</h2>
        <span className="text-muted-foreground text-sm">
          Grayola Test Assessment
        </span>
      </Link>
      <div className="space-x-2">
        {role === 'client' && (
          <Link href="/new-project">
            <Button type="button">New project</Button>
          </Link>
        )}
        <SignOutBtn />
      </div>
    </nav>
  )
}

export default navbar
