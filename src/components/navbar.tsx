import { BriefcaseBusiness } from 'lucide-react'
import Link from 'next/link'
import SignOutBtn from './signOutBtn'
import { Button } from './ui/button'
import { User } from '@prisma/client'
import { FC } from 'react'

interface navbarProps {
  user: User | null
}

const navbar: FC<navbarProps> = async ({ user }) => {
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
      bg-white/75
      backdrop-filter backdrop-blur-sm
      grid
      grid-cols-3
      items-center
      z-50
    "
    >
      <Link href="/projects" className="flex items-center gap-x-6">
        <BriefcaseBusiness />
        <h2 className="text-2xl m-0 p-0 font-bold">Augusto GTA</h2>
      </Link>
      <div className="flex items-center justify-center">
        <span className="text-muted-foreground text-xs">
          Grayola Test Assessment
        </span>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {user && user.role === 'client' && (
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
