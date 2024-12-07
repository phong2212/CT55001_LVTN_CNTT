'use client'

import React from 'react'
import SearchBar from '../Search/SearchBar';
import SearchHotel from '../Search/SearchHotel';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import { ChatBox } from '../ChatBox/ChatBox';



function SearchingPage() {
    const { searchResult} = useGlobalState();

    return (
        <div className='h-full caret-transparent'>
            <ChatBox />
            <div className="bg-primary h-72 caret-transparent relative">
                <div className="flex flex-col items-center justify-center">

                    <p className="text-5xl font-bold m-16 text-white">Tìm kiếm khách sạn tại đây</p>

                    <SearchBar />
                </div>
            </div>
            {searchResult && <SearchHotel />}

        </div>


    )
}

export default SearchingPage