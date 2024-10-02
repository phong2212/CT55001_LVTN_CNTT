'use client'

import { useGlobalState } from '@/app/hooks/useGlobalState';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function CreateContent() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [city , setCity ] = useState('');
    const [rating, setRating] = useState(0.0);
    const [description, setDescription] = useState('');
    const [amenities, setAmenities] = useState({ wifi: false, pool: false, gym: false });
    const handleChange = (name: string) => (e: any) => {
        switch (name) {
            case 'name':
                setName(e.target.value);
                break;
            case 'location':
                setLocation(e.target.value);
                break;
            case 'city':
                setCity (e.target.value);
                break;
            case 'rating':
                setRating(parseFloat(e.target.value));
                break;
            case 'description':
                setDescription(e.target.value);
                break;
            case 'amenities':
                setAmenities({
                    ...amenities,
                    [e.target.name]: e.target.checked
                });
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const hotels = {
            name,
            location,
            city,
            rating,
            description,
            amenities
        };

        try {
            const res = await axios.post("/api/hotels", hotels);

            if (res.data.error) {
                toast.error(res.data.error);
            }

            if (!res.data.error) {
                toast.success("Tạo khách sạn thành công!");
            }
        } catch (error) {
            toast.error("Tạo khách sạn thất bại!");
            console.error(error);
        }
    }

    return (
        <form className='container px-20 caret-transparent' onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl mb-8 text-center font-semibold leading-7 text-gray-100">Tạo khách sạn mới</h2>
                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Tên khách sạn</span>
                        </div>
                        <input
                            type="text"
                            id="tittle"
                            value={name}
                            name="name"
                            onChange={handleChange("name")}
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Nhập tên khách sạn..."
                        />
                    </label>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Vị trí khách sạn</span>
                        </div>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            name="location"
                            onChange={handleChange("location")}
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Nhập tên khách sạn..."
                        />
                    </label>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Tên quốc gia</span>
                        </div>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            name="city"
                            onChange={handleChange("city")}
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Nhập tên khách sạn..."
                        />
                    </label>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Điểm rating</span>
                        </div>
                        <input
                            type="number"
                            id="rating"
                            value={rating}
                            name="rating"
                            onChange={handleChange("rating")}
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Nhập điểm rating..."
                            min="1"
                            max="5"
                            step="0.1"
                        />
                    </label>

                    <label className=' form-control w-full max-w-xs mt-2'>
                        <div className="label">
                            <span className="label-text text-gray-300 ">Mô tả</span>
                        </div>
                        <textarea
                            id="description"
                            value={description}
                            name="description"
                            onChange={handleChange("description")}
                            className="textarea textarea-bordered flex items-center "
                            placeholder="Nhập mô tả..."
                            rows={4}
                        />
                    </label>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">WiFi</span>
                        </div>
                        <input
                            type="checkbox"
                            name="wifi"
                            checked={amenities.wifi}
                            onChange={handleChange("amenities")}
                            className="checkbox"
                        />
                    </label>
                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Pool</span>
                        </div>
                        <input
                            type="checkbox"
                            name="pool"
                            checked={amenities.pool}
                            onChange={handleChange("amenities")}
                            className="checkbox"
                        />
                    </label>
                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Gym</span>
                        </div>
                        <input
                            type="checkbox"
                            name="gym"
                            checked={amenities.gym}
                            onChange={handleChange("amenities")}
                            className="checkbox"
                        />
                    </label>


                </div>
            </div>
            <div className="flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-red-500" >
                    Hủy
                </button>
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

export default CreateContent;