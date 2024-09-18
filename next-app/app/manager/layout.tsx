'use client'

import SideBar from "../components/SideBar/SideBar";
import { useGlobalState } from "../context/globalProvider";
import NotFound from "../not-found";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isAdmin, isLoadingAdmin } = useGlobalState();

    return (
        isLoadingAdmin ? (
            <div className='overflow-hidden'>
                <div className='flex flex-row justify-center items-end h-[24rem]'>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        ) : isAdmin ? (
            <div data-theme="dark" className='p-10 flex gap-10 h-screen'>
                <SideBar />
                {children}
            </div>
        ) : (
            <NotFound />
        )
    );
}
