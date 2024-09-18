'use client'


import { useGlobalState, useGlobalUpdate } from '@/app/context/globalProvider';
import React, { useState} from 'react'
import toast from 'react-hot-toast';
import SearchDest from '../Search/SearchDest';
import SearchBar from '../Search/SearchBar';

function HomePage() {

    return (
        <div className='h-full caret-transparent'>

            <div className="bg-primary h-72 caret-transparent relative">
                <div className="flex flex-col items-center justify-center">

                    <p className="text-4xl font-bold m-20 text-white">Tìm kiếm khách sạn tại đây</p>

                    <SearchBar />
                </div>
            </div>
            <SearchDest />
            
           
           <div className='container h-80'>

           </div>
        </div >
    )
}

export default HomePage