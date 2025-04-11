'use client'

import { FC, useState, useEffect } from 'react'
import { ImagePlus, Trash } from 'lucide-react'
import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'
import { Button } from './ui/button'

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  ...props
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onUpload = (result: any) => {
    // const url = result?.info?.secure_url
    console.log(result)

    // url ? onChange(url) : console.error('Error uploading image')
  }

  if (!mounted) return null

  return (
    <div>
      <div className="flex items-center gap-4">
        {value &&
          value.map((url, i) => (
            <div
              key={i}
              className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
            >
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => onRemove(url)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <Image src={url} alt={url} fill className="object-cover" />
            </div>
          ))}
      </div>
      <CldUploadWidget
        signatureEndpoint={'/api/sign-cloudinary-params'}
        onUploadAdded={onUpload}
        {...props}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              variant="secondary"
              onClick={() => open()}
              disabled={disabled}
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload
