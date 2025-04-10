import { FC } from 'react'
import { Separator } from '@/components/ui/separator'
import SignInForm from '@/components/signInForm'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <h1 className="text-2xl mb-2">Welcome back to Augusto's GTA</h1>
      <p className="max-w-prose">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
        ratione rerum illum libero accusamus? Corrupti explicabo totam tempora
        dolorum voluptatum quisquam quidem qui voluptatibus. Dicta, commodi
        deserunt? Rem, vitae sed.
      </p>
      <Separator className="my-8" />
      <SignInForm />
    </div>
  )
}

export default page
