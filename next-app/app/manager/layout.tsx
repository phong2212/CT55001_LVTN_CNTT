'use client'

import SideBar from "../components/SideBar/SideBar";
import { useGlobalState } from "../context/GlobalProvider";
import NotFound from "../not-found";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isAdmin, isLoadingAdmin } = useGlobalState();

    if (isLoadingAdmin) {
        return   <div className='flex justify-center items-center h-screen'>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>; 
    }
    return (
        isAdmin ? (
            <div data-theme="light" className='flex h-screen'>
                <SideBar />
                <div className='flex-1 p-10 overflow-auto'>
                    {children}
                </div>
            </div>
        ) : (
            <NotFound />
        )
    );
}
