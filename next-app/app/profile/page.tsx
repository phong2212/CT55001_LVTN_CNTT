'use client'

import { UserProfile } from '@clerk/nextjs'
import React from 'react'
import Image from 'next/image'

const page = () => {
    return (
        <div className='bg-sky-300 py-28 h-full w-full flex items-center justify-center'>
            <UserProfile />

        </div>
    )
}

export default page