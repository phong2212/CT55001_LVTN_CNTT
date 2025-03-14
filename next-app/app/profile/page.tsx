'use client'

import { UserProfile } from '@clerk/nextjs'
import React from 'react'

const ProfilePage = () => {
    return (
        <div className='bg-primary pb-10 h-full w-full flex items-center justify-center'>
            <UserProfile routing="hash" />

        </div>
    )
}

export default ProfilePage