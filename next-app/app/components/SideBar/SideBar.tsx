'use client'

import React from 'react'
import menu from "@/app/utils/menu"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { signout } from '@/app/utils/Icons';
import { useClerk } from '@clerk/nextjs';

function SideBar() {
    const { signOut } = useClerk();
    const pathname = usePathname();
    const router = useRouter();
    const handleClick = (link: string) => {
        router.push(link);
    };
    return (
        <nav className='relative w-1/6 bg-gray-800 border-2 border-solid border-gray-600 rounded-2xl flex flex-col justify-between caret-transparent'>
            <div className='m-6 px-3 py-12'>
                <a href='/' className="btn glass text-xl w-full font-medium">Wanderlust</a>
            </div>
            <ul className='mb-40'>
                {menu.map((item) => {
                    const link = item.link;
                    return (
                        <li className={clsx(
                            'relative py-3 pr-4 pl-8 mx-0 my-[0.3rem] grid grid-cols-5 cursor-pointer after:absolute after:content-[""] after:bottom-0 after:left-0 after:top-0 after:right-0 after:h-full after:w-0 after:bg-gray-500 after:opacity-20 after:z-10 after:transition-all after:ease-in-out after:delay-300 before:absolute before:content-[""] before:bottom-0 before:left-0 before:top-0 before:right-0 before:h-full before:w-0 before:bg-sky-400 before:rounded-l-md hover:after:w-full',
                            {
                                'after:w-full text-white before:w-1': pathname === link,
                            },
                        )}
                            onClick={() => handleClick(link)}
                            key={item.id}
                        >
                            {item.icon}
                            <Link href={link} className='font-medium transition-all delay-300 ease-in-out z-20'>
                                {item.title}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <div className='h-12 flex items-center justify-center mb-5'>
                <button onClick={() => signOut(() => router.push("/"))} className='btn btn-ghost font-bold text-xl flex flex-row items-center justify-center'>{signout} <span className='ml-3'>Đăng xuất</span></button>
            </div>
        </nav>
    )
}

export default SideBar