'use client'

import React, { useState, useCallback } from 'react'
import menu from "@/app/utils/menu"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { signout, menu as menuIcon, arrowRight, arrowLeft } from '@/app/utils/Icons';
import { useClerk } from '@clerk/nextjs';

const SideBar = React.memo(() => {
    const { signOut } = useClerk();
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleClick = useCallback((link: string) => {
        router.push(link);
    }, [router]);

    const toggleSidebar = useCallback(() => {
        setIsCollapsed(prevState => !prevState);
    }, []);

    return (
        <nav className={clsx('bg-gray-100 border-r-2 border-solid border-gray-300 flex flex-col justify-between caret-transparent transition-width duration-300', {
            'w-1/6': !isCollapsed,
            'w-16': isCollapsed,
        })}>
            <div className='flex flex-col items-center'>
                <button onClick={toggleSidebar} className='btn btn-ghost my-4 w-12 h-12 flex items-center justify-center'>
                    {isCollapsed ? arrowRight : arrowLeft}
                </button>
                <a href='/' className={clsx("btn glass text-2xl font-bold transition-all duration-300 mb-4 flex items-center justify-center", {
                    'w-12 h-12': isCollapsed,
                    'w-54': !isCollapsed,
                })}>
                    {isCollapsed ? 'W' : 'Wanderlust'}
                </a>
            </div>
            <ul className='flex-grow'>
                {menu.map(({ id, link, icon, title }) => (
                    <li className={clsx(
                        'relative h-14 py-3 px-6 mx-0 my-1 cursor-pointer flex items-center justify-center after:absolute after:content-[""] after:bottom-0 after:left-0 after:top-0 after:right-0 after:h-full after:w-0 after:bg-blue-200 after:opacity-20 after:z-10 after:transition-all after:ease-in-out after:delay-300 before:absolute before:content-[""] before:bottom-0 before:left-0 before:top-0 before:right-0 before:h-full before:w-0 before:bg-blue-500 before:rounded-l-md hover:after:w-full',
                        {
                            'after:w-full text-black before:w-1': pathname === link,
                        },
                    )}
                        onClick={() => handleClick(link)}
                        key={id}
                    >
                        {icon}
                        <Link href={link} className={clsx('font-medium transition-all delay-300 ease-in-out z-20 ml-2', {
                            'hidden': isCollapsed,
                            'block': !isCollapsed,
                        })}>
                            {title}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className='h-12 flex items-center justify-center mb-4'>
                <button onClick={() => signOut(() => router.push("/"))} className={clsx('btn btn-ghost font-bold text-xl flex items-center justify-center transition-all duration-300', {
                    'w-12 h-12': isCollapsed,
                    'w-54': !isCollapsed,
                })}>
                    {signout} 
                    <span className={clsx('ml-3 transition-opacity duration-300', {
                        'hidden': isCollapsed,
                        'block': !isCollapsed,
                    })}>
                        Đăng xuất
                    </span>
                </button>
            </div>
        </nav>
    )
});

export default SideBar;
