import { FC } from 'react'
import { getUser } from '@/lib/actions/getUser'
import Navbar from '@/components/navbar'

interface layoutProps {
  children: React.ReactNode
}

const layout: FC<layoutProps> = async ({ children }) => {
  const user = await getUser()
  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  )
}

export default layout
