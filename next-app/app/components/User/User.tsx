'use client'

import React, { useState } from 'react'
import { useGlobalState, useGlobalUpdate } from '../../context/globalProvider';
import UserItem from '../UserItem/UserItem';


interface Props {
    title: string;
}

interface Users {
    id: string;
    clerkId: string;
    email: string;
    photo: string;
    firstName: string;
    lastName: string;
    createdAt: GLfloat;
}

function User({ title }: Props) {
    const { users, currentPageUser, searchTermUser, setSearchTermUser, totalPagesUser, setCurrentPageUser, isLoading } = useGlobalState();
    const { allUsers } = useGlobalUpdate();


    const handleSearchChange = (e: any) => {
        setSearchTermUser(e.target.value);
    };

    const handleSearchSubmit = (e: any) => {
        e.preventDefault();
        allUsers(1, searchTermUser);
    };

    const goToNextPage = () => {
        if (currentPageUser < totalPagesUser) {
            setCurrentPageUser(currentPageUser + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPageUser > 1) {
            setCurrentPageUser(currentPageUser - 1);
        }
    };

    return (
        <div className='p-2 w-full bg-gray-800 border-2 border-solid border-gray-600 rounded-2xl overflow-hidden caret-transparent'>
            <div className='flex flex-row justify-between my-5 mx-5'>
                <h1 className='relative text-2xl font-extrabold'>{title}</h1>
                <form onSubmit={handleSearchSubmit}>
                    <div className='form-control flex flex-row'>
                        <input
                            type="text"
                            value={searchTermUser}
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
                            <th>Email</th>
                            <th>Tên</th>
                            <th>Họ</th>
                            <th>Ngày tạo tài khoản</th>
                            <th>Ảnh đại diện</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: Users) => (
                            <UserItem
                                key={user.id}
                                id={user.clerkId}
                                email={user.email}
                                firstname={user.firstName}
                                lastname={user.lastName}
                                createdAt={new Date(user.createdAt)}
                                photo={user.photo}
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
            <div className='join flex justify-center mt-2'>
                <button className='join-item btn' onClick={goToPreviousPage} disabled={currentPageUser <= 1}>Trước</button>
                <span className='join-item btn'>{currentPageUser} </span>
                <button className='join-item btn' onClick={goToNextPage} disabled={currentPageUser >= totalPagesUser}>Sau</button>
            </div>
        </div>
    );
}

export default User