'use client'

import React from 'react'
import SearchForm from '../SearchForm/SearchForm';
import Pagination from '../Pagination/Pagination';
import { plus } from '@/app/utils/Icons';
import Modal from '../Modals/Modal';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import { useGlobalUpdate } from '@/app/hooks/useGlobalUpdate';
import HotelImageItem from '../HotelImgItem/HotelImgItem';
import CreateHotelImage from '../Modals/CreateHotelImage';

interface Props {
    title: string;
}

interface Imgs {
    id: string;
    hotelId: string;
    imageTitle: string;
    imageUrl: string;
}

interface Hotels {
    id: string;
    name: string;
}

function HotelImage({ title }: Props) {
    const { imgs, allHotel, currentPageImg, searchTermImg, setSearchTermImg, isLoading, totalPagesImg, setCurrentPageImg, openModal, modal } = useGlobalState();
    const { allImgs } = useGlobalUpdate();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTermImg(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        allImgs(1, searchTermImg);
    };

    const goToNextPage = () => {
        if (currentPageImg < totalPagesImg) {
            setCurrentPageImg(currentPageImg + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPageImg > 1) {
            setCurrentPageImg(currentPageImg - 1);
        }
    };

    return (
        <div className='p-2 w-full bg-white rounded-2xl overflow-hidden'>
            {modal && <Modal content={<CreateHotelImage />} />}
            <div className='flex flex-row justify-between my-5 mx-5'>
                <h1 className='text-2xl font-extrabold'>{title}</h1>
                <div className="flex items-center">
                    <SearchForm
                        searchTerm={searchTermImg}
                        onSearchChange={handleSearchChange}
                        onSearchSubmit={handleSearchSubmit}
                    />
                    <button onClick={openModal} className="ml-4 btn btn-info rounded-xl text-white px-3 py-2 flex items-center">
                        {plus} Thêm hình ảnh
                    </button>
                </div>
            </div>
            {!isLoading ? (
                <>
                    {imgs.length === 0 ? (
                        <div className="flex justify-center items-center my-56 ">
                            <span className="text-gray-500 font-bold text-3xl">Chưa có dữ liệu</span>
                        </div>
                    ) : (
                        <table className="table w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 p-2">Tên khách sạn</th>
                                    <th className="border border-gray-300 p-2">Tên Hình ảnh</th>
                                    <th className="border border-gray-300 p-2">Ảnh khách sạn</th>
                                    <th className="border border-gray-300 p-2">Sửa</th>
                                    <th className="border border-gray-300 p-2">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {imgs.map((hotelImage: Imgs) => {
                                    const hotelName = allHotel.find((hotel: Hotels) => hotel.id === hotelImage.hotelId);
                                    return (
                                        <HotelImageItem
                                            key={hotelImage.id}
                                            id={hotelImage.id}
                                            imageTitle={hotelImage.imageTitle}
                                            hotel={hotelName ? `${hotelName.name}` : 'Không tồn tại'}
                                            imageUrl={hotelImage.imageUrl}
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
            {imgs.length > 0 && (
                <Pagination
                    currentPage={currentPageImg}
                    totalPages={totalPagesImg}
                    onNextPage={goToNextPage}
                    onPreviousPage={goToPreviousPage}
                />
            )}
        </div>
    );
}

export default HotelImage