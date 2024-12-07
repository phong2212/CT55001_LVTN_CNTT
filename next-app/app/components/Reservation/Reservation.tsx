'use client'

import React from 'react'
import SearchForm from '../SearchForm/SearchForm';
import Pagination from '../Pagination/Pagination';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import { useGlobalUpdate } from '@/app/hooks/useGlobalUpdate';
import ReservationItem from '../ReservationItem/ReservationItem';

interface Props {
    title: string;
}

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

interface Rooms {
    id: string;
    roomType: string;
}

interface Users {
    id: string;
    firstName: string;
    lastName: string;
}

function Reservation({ title }: Props) {
    const { reservation, currentPageReservation, searchTermReservation, setSearchTermReservation, isLoading, totalPagesReservation, setCurrentPageReservation, allRoom, allUser} = useGlobalState();
    const { allReservations} = useGlobalUpdate();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTermReservation(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        allReservations(1, searchTermReservation);
    };

    const goToNextPage = () => {
        if (currentPageReservation < totalPagesReservation) {
            setCurrentPageReservation(currentPageReservation + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPageReservation > 1) {
            setCurrentPageReservation(currentPageReservation - 1);
        }
    };

    return (
        <div className='p-2 w-full bg-white rounded-2xl overflow-hidden'>
            <div className='flex flex-row justify-between my-5 mx-5'>
                <h1 className='text-2xl font-extrabold'>{title}</h1>
                <div className="flex items-center">
                    <SearchForm 
                        searchTerm={searchTermReservation} 
                        onSearchChange={handleSearchChange} 
                        onSearchSubmit={handleSearchSubmit} 
                    />
                </div>
            </div>
            {!isLoading ? (
                <>
                    {reservation.length === 0 ? ( 
                        <div className="flex justify-center items-center my-56 ">
                            <span className="text-gray-500 font-bold text-3xl">Chưa có đơn</span> 
                        </div>
                    ) : (
                        <table className="table w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 p-2">Tên phòng</th>
                                    <th className="border border-gray-300 p-2">Tên tài khoản</th>
                                    <th className="border border-gray-300 p-2">Tên đầy đủ</th>
                                    <th className="border border-gray-300 p-2">Số điện thoại</th>
                                    <th className="border border-gray-300 p-2">Email</th>
                                    <th className="border border-gray-300 p-2">Ngày đến</th>
                                    <th className="border border-gray-300 p-2">Ngày đi</th>
                                    <th className="border border-gray-300 p-2">Tình trạng</th>
                                    <th className="border border-gray-300 p-2">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservation.map((reservation: Reservation) => {
                                    const roomName = allRoom.find((room: Rooms) => room.id === reservation.roomId);
                                    const userName = allUser.find((user: Users) => user.id === reservation.userId);
                                    return (
                                        <ReservationItem 
                                            key={reservation.id} 
                                            id={reservation.id} 
                                            room={roomName ? `${roomName.roomType}` : 'Không tồn tại'}
                                            user={userName ? `${userName.firstName + ' ' + userName.lastName}` : 'Không tồn tại'}
                                            FullName={reservation.FullName}
                                            PhoneNumber={reservation.PhoneNumber} 
                                            Email={reservation.Email} 
                                            Status={reservation.Status} 
                                            DateIn={new Date(reservation.DateIn).toLocaleString()}
                                            DateOut={new Date(reservation.DateOut).toLocaleString()}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </>
            ) : (
                <div className='flex justify-center items-center h-[27.7rem]'>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}
            {reservation.length > 0 && (
                <Pagination 
                    currentPage={currentPageReservation} 
                    totalPages={totalPagesReservation} 
                    onNextPage={goToNextPage} 
                    onPreviousPage={goToPreviousPage} 
                />
            )}
        </div>
    );
}

export default Reservation
