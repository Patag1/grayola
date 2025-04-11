import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getUser } from '@/lib/actions/getUser'
import Link from 'next/link'

export default async function Home() {
  const user = await getUser()

  return (
    <div>
      <h1 className="text-center text-5xl">Grayola test assesment</h1>
      <Separator className="w-10/12 my-4 mx-auto" />
      <p className="max-w-prose">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore et,
        autem placeat at maiores explicabo tempora, in voluptatibus soluta
        quisquam architecto molestias alias temporibus a, hic perferendis
        repudiandae magni earum?
      </p>
      <p>
        {user
          ? `Welcome back ${user.email?.split('@')[0]}!`
          : 'Sign up now and join us.'}
      </p>
      {user ? (
        <Link href={'/projects'}>
          <Button type="button" className="my-4">
            To projects
          </Button>
        </Link>
      ) : (
        <div className="flex items-center gap-x-2">
          <Link href={'/signup'}>
            <Button type="button" className="my-4">
              Sign up
            </Button>
          </Link>
          <Link href={'/signin'}>
            <Button
              type="button"
              variant={'outline'}
              className="my-4"
            >
              Sign in
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
