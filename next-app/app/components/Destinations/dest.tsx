'use client'

import React, { useState } from 'react'
import DestItem from '../DestItem/DestItem';
import { plus } from '@/app/utils/Icons';
import { useGlobalState, useGlobalUpdate } from '../../context/globalProvider';
import CreateContent from '../Modals/CreateContent';
import Modal from '../Modals/Modal';


interface Props {
    title: string;
}

interface Destinations {
    id: string;
    name: string;
    description: string;
    continent: string;
    country: string;
    city: string;
    imageURL: string;
}

function Dest({ title }: Props) {
    const { destinations, searchTermDest, setSearchTermDest, currentPageDest, totalPagesDest, setCurrentPageDest, isLoading, openModal, modal } = useGlobalState();
    const { allDests } = useGlobalUpdate();

    const handleSearchChange = (e: any) => {
        setSearchTermDest(e.target.value);
    };

    const handleSearchSubmit = (e: any) => {
        e.preventDefault();
        allDests(1, searchTermDest);
    };

    const goToNextPage = () => {
        if (currentPageDest < totalPagesDest) {
            setCurrentPageDest(currentPageDest + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPageDest > 1) {
            setCurrentPageDest(currentPageDest - 1);
        }
    };

    return (
        <div className='p-2 w-full bg-gray-800 border-2 border-solid border-gray-600 rounded-2xl overflow-hidden caret-transparent'>
            <div className='flex flex-row justify-between my-5 mx-5'>
                {modal && <Modal content={<CreateContent />} />}
                <h1 className='relative text-2xl font-extrabold'>{title}</h1>
                <form onSubmit={handleSearchSubmit}>
                    <div className='form-control flex flex-row'>
                        <input
                            type="text"
                            value={searchTermDest}
                            className='input input-bordered w-24 md:w-auto'
                            onChange={handleSearchChange}
                            placeholder="Tìm kiếm..."
                        />
                        <button type='submit' className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>
                </form>

            </div>
            {!isLoading ? (
                <table className="table table-xs">
                    <thead>
                        <tr>
                            <th>Tên địa điểm</th>
                            <th className='w-80'>Mô tả</th>
                            <th>Châu lục</th>
                            <th>Quốc gia</th>
                            <th>Thành phố</th>
                            <th>Ảnh địa điểm</th>
                            <th>Sửa/Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {destinations.map((destination: Destinations) => (
                            <DestItem
                                key={destination.id}
                                id={destination.id}
                                name={destination.name}
                                description={destination.description}
                                continent={destination.continent}
                                country={destination.country}
                                city={destination.city}
                                imageURL={destination.imageURL}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>
                    <div className='flex flex-row justify-center items-center h-[27.7rem]'>
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                </div>
            )}
            <div className='flex justify-end mr-10 mt-2'>
                <div className='join '>
                    <button className='join-item btn' onClick={goToPreviousPage} disabled={currentPageDest <= 1}>Trước</button>
                    <span className='join-item btn'>{currentPageDest} </span>
                    <button className='join-item btn' onClick={goToNextPage} disabled={currentPageDest >= totalPagesDest}>Sau</button>
                </div>
                <div className='ml-72'>
                    <button className='btn btn-accent' onClick={openModal}>{plus} Thêm địa điểm</button>
                </div>
            </div>

        </div>
    );
}

export default Dest