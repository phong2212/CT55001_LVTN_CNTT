'use client'

import React, { useEffect, useState } from 'react'
import Pagination from '../Pagination/Pagination';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import AvailabilityItem from '../AvailabilityItem/AvailabilityItem';
import { useGlobalUpdate } from '@/app/hooks/useGlobalUpdate';

interface Props {
    title: string;
}

interface Rooms {
    id: string;
    roomType: string;
}

interface Availabilities {
    id: string;
    roomId: string;
    available: boolean;
}

function Availability({ title }: Props) {
    const { availabilities, currentPageAvailable, isLoading, totalPagesAvailable, setCurrentPageAvailable, allRoom, filter, setFilter } = useGlobalState();
    const { allAvailabilities } = useGlobalUpdate();

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        setCurrentPageAvailable(1);
    };

    useEffect(() => {
        allAvailabilities(currentPageAvailable, filter);
    }, [currentPageAvailable, filter]);

    const goToNextPage = () => {
        if (currentPageAvailable < totalPagesAvailable) {
            setCurrentPageAvailable(currentPageAvailable + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPageAvailable > 1) {
            setCurrentPageAvailable(currentPageAvailable - 1);
        }
    };

    return (
        <div className='p-2 w-full bg-white rounded-2xl overflow-hidden'>
            <div className='flex flex-row justify-between my-5 mx-5'>
                <h1 className='text-2xl font-extrabold'>{title}</h1>
                <select onChange={(e) => handleFilterChange(e.target.value)} value={filter}>
                    <option value="all">Tất cả</option>
                    <option value="true">Sẵn sàng</option>
                    <option value="false">Đang xử lí</option>
                </select>
            </div>
            {!isLoading ? (
                <>
                    {availabilities.length === 0 ? (
                        <div className="flex justify-center items-center my-56 ">
                            <span className="text-gray-500 font-bold text-3xl">Chưa có dữ liệu</span>
                        </div>
                    ) : (
                        <table className="table w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 p-2">Tên phòng</th>
                                    <th className="border border-gray-300 p-2" style={{ width: '200px' }}>Tình trạng phòng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availabilities.map((able: Availabilities) => {
                                    const roomName = allRoom.find((room: Rooms) => room.id === able.roomId);
                                    return (
                                        <AvailabilityItem
                                            key={able.id}
                                            id={able.id}
                                            room={roomName ? `${roomName.roomType}` : 'Không tồn tại'}
                                            available={able.available}
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
            {availabilities.length > 0 && (
                <Pagination
                    currentPage={currentPageAvailable}
                    totalPages={totalPagesAvailable}
                    onNextPage={goToNextPage}
                    onPreviousPage={goToPreviousPage}
                />
            )}
        </div>
    );
}

export default Availability
