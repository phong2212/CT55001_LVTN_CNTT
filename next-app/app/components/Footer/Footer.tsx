'use client'

import Link from 'next/link'
import React from 'react'
import socialmedia from "@/app/utils/socialmedia"
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import footer from "@/app/utils/footer"
import { address, email, phone } from '@/app/utils/Icons';


const Footer = () => {
    const pathname = usePathname();
    const isManagerPath = /^\/manager(\/|$)/.test(pathname);
    const isSignInPath = /^\/sign-in(\/|$)/.test(pathname);
    const isSignUpPath = /^\/sign-up(\/|$)/.test(pathname);

    const shouldHideFooter = isManagerPath || isSignInPath || isSignUpPath;

    if (shouldHideFooter) {
        return null;
    }

    return <div className=''>
        <hr />
        <div className="footer p-10 bg-base-100 text-base-content flex justify-between caret-transparent">
            <aside>
                <Link href={"/"} className="btn btn-ghost text-4xl text-sky-500">Travel Hub</Link>
                <p className='pl-5 text-lg text-semibold'>The important thing about the journey is <br /> the experience!</p>
            </aside>
            <nav>
                <h6 className="footer-title">Trang khác</h6>
                {footer.map((item) => {
                    const link = item.link;
                    if (link !== pathname) {
                        return (
                            <Link href={link} className="link link-hover" key={item.id}>
                                {item.title}
                            </Link>
                        );
                    } else {
                        return null;
                    }
                })}
            </nav>
            <nav>
                <h6 className="footer-title">Chứng chỉ</h6>
                <a className="link link-hover">Điều khoản sử dụng</a>
                <a className="link link-hover">Chính sách bảo mật</a>
                <a className="link link-hover">Chính sách cookie</a>
            </nav>
            <nav className=' w-80'>
                <h6 className="footer-title">Liên hệ</h6>
                <div className='flex flex-row items-center'>
                    <span className='text-lg text-bold'>{email}</span>
                    <p className='ml-5 text-md '> travelhub@gmail.com</p>
                </div >
                <div className='flex flex-row items-center mt-2'>
                    <span className='text-lg text-bold'> {phone}</span>
                    <p className='ml-5 text-md '>+84 999999999</p>
                </div>
                <div className='flex flex-row mt-2'>
                    <span className='text-lg text-bold'>  {address}</span>
                    <p className='ml-5 text-md'>Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ, Việt Nam</p>
                </div>
            </nav>
        </div>
        <div className="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
            <aside className="items-center grid-flow-col">

                <p>Copyright © 2024 - All right reserved</p>
            </aside>
            <nav className="md:place-self-center md:justify-self-end">
                <div className="grid grid-flow-col gap-2">
                    {socialmedia.map((item) => {
                        return (
                            <a className="text-2xl hover:text-sky-500" href={item.link} key={item.id}>{item.icon}</a>
                        );
                    })}
                </div>
            </nav>
        </div>
    </div>
}

export default Footer