'use client'

import { useGlobalState } from '@/app/hooks/useGlobalState';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Props {
    destinationId: string;
}

function UpdateContent({ destinationId }: Props) {
    const { closeModal, allDests } = useGlobalState();
    const [destination, setDestination] = useState({
        name: '',
        description: '',
        continent: '',
        country: '',
        city: '',
        imageURL: '',
    });

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const response = await axios.get(`/api/destinations/${destinationId}`);
                setDestination(response.data.destination);
            } catch (error) {
                toast.error("Lỗi khi lấy thông tin địa điểm");
                console.error(error);
            }
        };

        fetchDestination();
    }, [destinationId]);


    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setDestination(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const res = await axios.put(`/api/destinations/${destinationId}`, destination);

            if (res.data.error) {
                toast.error(res.data.error);
            } else {
                toast.success("Cập nhật địa điểm thành công!");
                allDests();
                closeModal();
            }
        } catch (error) {
            toast.error("Cập nhật địa điểm thất bại!");
            console.error(error);
        }
    };

    return (
        <form className='container px-20 caret-white' onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl mb-8 text-center font-semibold leading-7 text-gray-100">Chỉnh sửa địa điểm mới</h2>
                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Tên địa điểm</span>
                        </div>
                        <input
                            type="text"
                            id="name"
                            value={destination.name}
                            name="name"
                            onChange={handleChange}
                            className="input input-bordered w-full max-w-xs"
                            placeholder={destination.name || "Nhập tên địa điểm..."}
                        />
                    </label>
                    <label className=' form-control w-full max-w-xs mt-2'>
                        <div className="label">
                            <span className="label-text text-gray-300 ">Mô tả</span>
                        </div>
                        <textarea
                            id="description"
                            value={destination.description}
                            name="description"
                            onChange={handleChange}
                            className="textarea textarea-bordered flex items-center "
                            placeholder={destination.description || "Nhập mô tả..."}
                            rows={4}
                        />
                    </label>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Tên châu lục</span>
                        </div>
                        <input
                            type="text"
                            id="continent"
                            value={destination.continent}
                            name="continent"
                            onChange={handleChange}
                            className="input input-bordered w-full max-w-xs"
                            placeholder={destination.continent || "Nhập tên châu lục..."}
                        />
                    </label>


                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Tên quốc gia</span>
                        </div>
                        <input
                            type="text"
                            id="country"
                            value={destination.country}
                            name="country"
                            onChange={handleChange}
                            className="input input-bordered w-full max-w-xs"
                            placeholder={destination.country || "Nhập tên quốc gia..."}
                        />
                    </label>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Tên thành phố</span>
                        </div>
                        <input
                            type="text"
                            id="city"
                            value={destination.city}
                            name="city"
                            onChange={handleChange}
                            className="input input-bordered w-full max-w-xs"
                            placeholder={destination.city || "Nhập tên thành phố..."}
                        />
                    </label>


                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Link ảnh</span>
                        </div>
                        <input
                            type="text"
                            id="imageURL"
                            value={destination.imageURL}
                            name="imageURL"
                            onChange={handleChange}
                            className="input input-bordered w-full max-w-xs"
                            placeholder={destination.imageURL || "Nhập link ảnh..."}
                        />
                    </label>


                </div>
            </div>
            <div className="flex items-center justify-end gap-x-6">
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Lưu
                </button>
            </div>
        </form>
    )
}

export default UpdateContent;