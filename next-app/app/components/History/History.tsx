'use client'

import React from 'react'
import SearchBar from '../Search/SearchBar';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import { ChatBox } from '../ChatBox/ChatBox';
import { star } from '@/app/utils/Icons';
import { useAuth } from '@clerk/nextjs';
import HistoryItem from '../HistoryItem/HistoryItem';


interface Reservation {
    id: string;
    roomId: string;
    userId: string;
    FullName: string;
    PhoneNumber: string;
    Email: string;
    Status: boolean;
    DateIn: string;
    DateOut: string;
}

interface Users {
    id: string;
    clerkId: string;
}

interface Rooms {
    id: string;
    roomType: string;
}

function HistoryPage() {
    const {allReservation, allRoom } = useGlobalState();
    const { userId } = useAuth();
    const userHistory = allReservation.filter((r: Reservation) => r.userId === userId)

    return (
        <>
            <div className='h-full caret-transparent'>
                <ChatBox />
                <div className="bg-primary h-72 caret-transparent relative">
                    <div className="flex flex-col items-center justify-center">

                        <p className="text-5xl font-bold m-16 text-white">Tìm kiếm khách sạn tại đây</p>

                        <SearchBar />
                    </div>
                </div>


            </div>

            <div className='bg-base-200 p-16 m-16 rounded-badge drop-shadow-lg mt-32'>
                <div className='flex flex-row items-center'>
                    <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{star}</span>
                    <h1 className='text-3xl font-bold text-start text-sky-400'>
                        Lịch sử đơn hàng
                    </h1>
                </div>

                {userHistory.length === 0 ? (
                    <div className="flex justify-center items-center my-56 ">
                        <span className="text-gray-500 font-bold text-3xl">Chưa có dữ liệu</span>
                    </div>
                ) : (
                    <table className='table w-full border-collapse border border-gray-500 mt-10'>
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 p-2">Tên phòng</th>
                                <th className="border border-gray-300 p-2">Họ và Tên</th>
                                <th className="border border-gray-300 p-2">Số điện thoại</th>
                                <th className="border border-gray-300 p-2">Email</th>
                                <th className="border border-gray-300 p-2">Ngày nhận phòng</th>
                                <th className="border border-gray-300 p-2">Ngày trả phòng</th>
                                <th className="border border-gray-300 p-2">Tình trạng</th>
                            </tr>
                        </thead>
                        <tbody>

                            {userHistory.map((r: Reservation) => {
                                const roomName = allRoom.find((room: Rooms) => room.id === r.roomId);
                                return (
                                    <HistoryItem
                                        key={r.id}
                                        id={r.id}
                                        room={roomName ? `${roomName.roomType}` : 'Không tồn tại'}
                                        FullName={r.FullName}
                                        PhoneNumber={r.PhoneNumber}
                                        Email={r.Email}
                                        DateIn={r.DateIn}
                                        DateOut={r.DateOut}
                                        Status={r.Status}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </>

    )
}

export default HistoryPage