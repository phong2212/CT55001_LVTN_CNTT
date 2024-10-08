'use client'

import React from 'react'
import HotelItem from '../HotelItem/HotelItem';
import SearchForm from '../SearchForm/SearchForm';
import Pagination from '../Pagination/Pagination';
import { plus } from '@/app/utils/Icons';
import CreateHotel from '../Modals/CreateHotel';
import Modal from '../Modals/Modal';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import { useGlobalUpdate } from '@/app/hooks/useGlobalUpdate';

interface Props {
    title: string;
}

interface Hotels {
    id: string;
    name: string;
    location: string;
    city: string;
    rating: number;
    description: string;
    amenities: {
        wifi: boolean;
        pool: boolean;
        gym: boolean;
    };
    createdAt: string;
    updatedAt: string;
}

function Hotel({ title }: Props) {
    const { hotels, currentPageHotel, searchTermHotel, setSearchTermHotel, isLoading, totalPagesHotel, setCurrentPageHotel, openModal, modal } = useGlobalState();
    const { allHotels} = useGlobalUpdate();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTermHotel(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        allHotels(1, searchTermHotel);
    };

    const goToNextPage = () => {
        if (currentPageHotel < totalPagesHotel) {
            setCurrentPageHotel(currentPageHotel + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPageHotel > 1) {
            setCurrentPageHotel(currentPageHotel - 1);
        }
    };

    return (
        <div className='p-2 w-full bg-white rounded-2xl overflow-hidden'>
            {modal && <Modal content={<CreateHotel />} />}
            <div className='flex flex-row justify-between my-5 mx-5'>
                <h1 className='text-2xl font-extrabold'>{title}</h1>
                <div className="flex items-center">
                    <SearchForm 
                        searchTerm={searchTermHotel} 
                        onSearchChange={handleSearchChange} 
                        onSearchSubmit={handleSearchSubmit} 
                    />
                    <button onClick={openModal} className="ml-4 btn btn-info rounded-xl text-white px-3 py-2 flex items-center">
                        {plus} Thêm khách sạn
                    </button>
                </div>
            </div>
            {!isLoading ? (
                <>
                    {hotels.length === 0 ? ( 
                        <div className="flex justify-center items-center my-56 ">
                            <span className="text-gray-500 font-bold text-3xl">Chưa có dữ liệu</span> 
                        </div>
                    ) : (
                        <table className="table w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 p-2">Tên khách sạn</th>
                                    <th className="border border-gray-300 p-2">Địa chỉ</th>
                                    <th className="border border-gray-300 p-2">Thành phố</th>
                                    <th className="border border-gray-300 p-2">Đánh giá</th>
                                    <th className="border border-gray-300 p-2">Mô tả</th>
                                    <th className="border border-gray-300 p-2">Wifi</th>
                                    <th className="border border-gray-300 p-2">Bể bơi</th>
                                    <th className="border border-gray-300 p-2">Gym</th>
                                    <th className="border border-gray-300 p-2">Thời gian tạo</th>
                                    <th className="border border-gray-300 p-2">Thời gian cập nhật</th>
                                    <th className="border border-gray-300 p-2">Sửa</th>
                                    <th className="border border-gray-300 p-2">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotels.map((hotel: Hotels) => (
                                    <HotelItem 
                                        key={hotel.id} 
                                        id={hotel.id} 
                                        name={hotel.name} 
                                        location={hotel.location} 
                                        city={hotel.city} 
                                        rating={hotel.rating} 
                                        description={hotel.description}
                                        amenities={hotel.amenities}
                                        createdAt={new Date(hotel.createdAt).toLocaleString()}
                                        updatedAt={new Date(hotel.updatedAt).toLocaleString()}
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
            {hotels.length > 0 && (
                <Pagination 
                    currentPage={currentPageHotel} 
                    totalPages={totalPagesHotel} 
                    onNextPage={goToNextPage} 
                    onPreviousPage={goToPreviousPage} 
                />
            )}
        </div>
    );
}

export default Hotel