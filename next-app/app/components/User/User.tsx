'use client'

import React from 'react'
import { useGlobalState, useGlobalUpdate } from '../../context/GlobalProvider';
import UserItem from '../UserItem/UserItem';
import SearchForm from './SearchForm';
import Pagination from './Pagination';

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
    const { users, currentPageUser, searchTermUser, isLoading, totalPagesUser } = useGlobalState();
    const { allUsers, setSearchTermUser, setCurrentPageUser } = useGlobalUpdate();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTermUser(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        <div className='p-2 w-full bg-white rounded-2xl overflow-hidden'>
            <div className='flex flex-row justify-between my-5 mx-5'>
                <h1 className='text-2xl font-extrabold'>{title}</h1>
                <SearchForm 
                    searchTerm={searchTermUser} 
                    onSearchChange={handleSearchChange} 
                    onSearchSubmit={handleSearchSubmit} 
                />
            </div>
            {!isLoading ? (
                <table className="table w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 p-2">Email</th>
                            <th className="border border-gray-300 p-2">Tên</th>
                            <th className="border border-gray-300 p-2">Họ</th>
                            <th className="border border-gray-300 p-2">Ngày tạo tài khoản</th>
                            <th className="border border-gray-300 p-2">Ảnh đại diện</th>
                            <th className="border border-gray-300 p-2">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: Users) => (
                            <UserItem 
                                key={user.id} 
                                id={user.id} 
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
                <div className='flex justify-center items-center h-[27.7rem]'>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}
            <Pagination 
                currentPage={currentPageUser} 
                totalPages={totalPagesUser} 
                onNextPage={goToNextPage} 
                onPreviousPage={goToPreviousPage} 
            />
        </div>
    );
}

export default User