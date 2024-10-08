'use client'

import { useGlobalState } from '@/app/hooks/useGlobalState';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Props {
    hotelId: string;
}

function UpdateHotel({ hotelId }: Props) {
    const { closeModal, allHotels } = useGlobalState();
    const [hotel, setHotel] = useState({
        name: '',
        location: '',
        city: '',
        rating: 0,
        description: '',
        amenities: { wifi: false, pool: false, gym: false },
    });

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await axios.get(`/api/hotels/${hotelId}`);
                setHotel(response.data.hotel);
            } catch (error) {
                toast.error("Lỗi khi lấy thông tin khách sạn");
                console.error(error);
            }
        };

        fetchHotel();
    }, [hotelId]);

    const handleChange = (name: keyof typeof hotel | string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value, type } = e.target;
        if (type === 'checkbox') {
            setHotel(prev => ({
                ...prev,
                amenities: {
                    ...prev.amenities,
                    [name]: (e.target as HTMLInputElement).checked
                }
            }));
        } else {
            setHotel(prev => ({
                ...prev,
                [name]: name === 'rating' ? parseFloat(value) : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await axios.put(`/api/hotels/${hotelId}`, {
                ...hotel,
                rating: hotel.rating
            });

            if (res.data.error) {
                toast.error(res.data.error);
            } else {
                toast.success("Cập nhật khách sạn thành công!");
                allHotels();
                closeModal();
            }
        } catch (error) {
            toast.error("Cập nhật khách sạn thất bại!");
            console.error(error);
        }
    };

    const renderInput = (id: string, label: string, value: string | number, name: string, type: string = 'text') => (
        <label className="form-control w-full max-w-xs mt-2">
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
            <input
                type={type}
                id={id}
                value={value}
                name={name}
                onChange={handleChange(name)}
                className="input input-bordered w-full max-w-xs"
                placeholder={`Nhập ${label.toLowerCase()}...`}
                min={type === 'number' ? '1' : undefined}
                max={type === 'number' ? '5' : undefined}
            />
        </label>
    );

    const renderCheckbox = (amenity: string) => (
        <label className="form-control inline-block mr-4" key={amenity}>
            <div className="label">
                <span className="label-text ">{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
            </div>
            <input
                type="checkbox"
                name={amenity}
                checked={hotel.amenities[amenity as keyof typeof hotel.amenities]}
                onChange={handleChange(amenity)}
                className="checkbox"
            />
        </label>
    );

    return (
        <form className='container px-20' onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl mb-8 text-center font-semibold leading-7">Chỉnh sửa khách sạn</h2>
                    {renderInput("name", "Tên khách sạn", hotel.name, "name")}
                    {renderInput("location", "Địa chỉ khách sạn", hotel.location, "location")}
                    {renderInput("city", "Tên thành phố", hotel.city, "city")}
                    {renderInput("rating", "Điểm rating", hotel.rating, "rating", "number")}
                    <label className='form-control w-full max-w-xs mt-2'>
                        <div className="label">
                            <span className="label-text ">Mô tả</span>
                        </div>
                        <textarea
                            id="description"
                            value={hotel.description}
                            name="description"
                            onChange={handleChange("description")}
                            className="textarea textarea-bordered flex items-center"
                            placeholder="Nhập mô tả..."
                            rows={4}
                        />
                    </label>
                    
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Tiện nghi</h3>
                        {['wifi', 'pool', 'gym'].map(renderCheckbox)}
                    </div>
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

export default UpdateHotel;