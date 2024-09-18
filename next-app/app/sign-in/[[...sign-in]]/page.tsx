'use client'
import { SignIn } from '@clerk/nextjs'
import React from 'react'
import Image from 'next/image'

function page() {
    return (
        <div className='relative'>
            <div className='absolute h-screen w-full flex items-center justify-center'>
                <SignIn />
            </div>
            <Image
                width={1000}
                height={1000}
                src={"/img/bgsign-in.jpg"} alt={'Ảnh nền đăng nhập'}
                className='-z-10 h-screen w-full'
            />
        </div>
    )
}

export default page