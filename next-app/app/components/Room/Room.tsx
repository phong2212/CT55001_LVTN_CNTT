'use client'

import React from 'react'
import RoomItem from '../RoomItem/RoomItem';
import SearchForm from '../SearchForm/SearchForm';
import Pagination from '../Pagination/Pagination';
import { plus } from '@/app/utils/Icons';
import Modal from '../Modals/Modal';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import { useGlobalUpdate } from '@/app/hooks/useGlobalUpdate';

interface Props {
    title: string;
}

interface Rooms {
    id: string;
    hotelId: string;
    roomType: string;
    capacityAdults: number;
    capacityChildren: number;
    pricePerNight: number;
    numberOfRooms: number;
    createdAt: string;
    updatedAt: string;
}

function Room({ title }: Props) {
    const { rooms, currentPageRoom, searchTermRoom, setSearchTermRoom, isLoading, totalPagesRoom, setCurrentPageRoom, openModal, modal } = useGlobalState();
    const { allRooms} = useGlobalUpdate();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTermRoom(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        allRooms(1, searchTermRoom);
    };

    const goToNextPage = () => {
        if (currentPageRoom < totalPagesRoom) {
            setCurrentPageRoom(currentPageRoom + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPageRoom > 1) {
            setCurrentPageRoom(currentPageRoom - 1);
        }
    };

    return (
        <div className='p-2 w-full bg-white rounded-2xl overflow-hidden'>
            {/* {modal && <Modal content={<CreateRoom />} />} */}
            <div className='flex flex-row justify-between my-5 mx-5'>
                <h1 className='text-2xl font-extrabold'>{title}</h1>
                <div className="flex items-center">
                    <SearchForm 
                        searchTerm={searchTermRoom} 
                        onSearchChange={handleSearchChange} 
                        onSearchSubmit={handleSearchSubmit} 
                    />
                    <button onClick={openModal} className="ml-4 btn btn-info rounded-xl text-white px-3 py-2 flex items-center">
                        {plus} Thêm phòng
                    </button>
                </div>
            </div>
            {!isLoading ? (
                <>
                    {rooms.length === 0 ? ( 
                        <div className="flex justify-center items-center my-56 ">
                            <span className="text-gray-500 font-bold text-3xl">Chưa có dữ liệu</span> 
                        </div>
                    ) : (
                        <table className="table w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 p-2">Tên khách sạn</th>
                                    <th className="border border-gray-300 p-2">Loại phòng</th>
                                    <th className="border border-gray-300 p-2">Người lớn</th>
                                    <th className="border border-gray-300 p-2">Trẻ em</th>
                                    <th className="border border-gray-300 p-2">Giá 1 đêm</th>
                                    <th className="border border-gray-300 p-2">Số lượng phòng</th>
                                    <th className="border border-gray-300 p-2">Thời gian tạo</th>
                                    <th className="border border-gray-300 p-2">Thời gian cập nhật</th>
                                    <th className="border border-gray-300 p-2">Sửa</th>
                                    <th className="border border-gray-300 p-2">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room: Rooms) => (
                                    <RoomItem 
                                        key={room.id} 
                                        id={room.id} 
                                        hotelId={room.hotelId} 
                                        roomType={room.roomType} 
                                        capacityAdults={room.capacityAdults} 
                                        capacityChildren={room.capacityChildren} 
                                        pricePerNight={room.pricePerNight} 
                                        numberOfRooms={room.numberOfRooms} 
                                        createdAt={new Date(room.createdAt).toLocaleString()}
                                        updatedAt={new Date(room.updatedAt).toLocaleString()}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            ) : (
                <div className='flex justify-center items-center h-[27.7rem]'>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}
            {rooms.length > 0 && (
                <Pagination 
                    currentPage={currentPageRoom} 
                    totalPages={totalPagesRoom} 
                    onNextPage={goToNextPage} 
                    onPreviousPage={goToPreviousPage} 
                />
            )}
        </div>
    );
}

export default Room