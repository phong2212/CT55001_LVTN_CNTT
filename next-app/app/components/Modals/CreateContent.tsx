'use client'

import { useGlobalState } from '@/app/hooks/useGlobalState';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function CreateContent() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [city, setCity] = useState('');
    const [rating, setRating] = useState(0.0);
    const [description, setDescription] = useState('');
    const [amenities, setAmenities] = useState({ wifi: false, pool: false, gym: false });

    const handleChange = (name: keyof typeof amenities | string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked; // Type assertion
            setAmenities(prev => ({ ...prev, [name]: checked }));
        } else {
            switch (name) {
                case 'name': setName(value); break;
                case 'location': setLocation(value); break;
                case 'city': setCity(value); break;
                case 'rating': setRating(parseFloat(value)); break;
                case 'description': setDescription(value); break;
                default: break;
            }
        }
    }

    const renderInput = (id: string, label: string, value: string | number, name: string, type: string = 'text') => (
        <label className="form-control w-full max-w-xs mt-2">
            <div className="label">
                <span className="label-text text-gray-300">{label}</span>
            </div>
            <input
                type={type}
                id={id}
                value={value}
                name={name}
                onChange={handleChange(name)}
                className="input input-bordered w-full max-w-xs"
                placeholder={`Nhập ${label.toLowerCase()}...`}
            />
        </label>
    );

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
                    {renderInput("tittle", "Tên khách sạn", name, "name")}
                    {renderInput("location", "Vị trí khách sạn", location, "location")}
                    {renderInput("city", "Tên quốc gia", city, "city")}
                    {renderInput("rating", "Điểm rating", rating, "rating", "number")}
                    <label className='form-control w-full max-w-xs mt-2'>
                        <div className="label">
                            <span className="label-text text-gray-300">Mô tả</span>
                        </div>
                        <textarea
                            id="description"
                            value={description}
                            name="description"
                            onChange={handleChange("description")}
                            className="textarea textarea-bordered flex items-center"
                            placeholder="Nhập mô tả..."
                            rows={4}
                        />
                    </label>
                    {['wifi', 'pool', 'gym'].map((amenity) => (
                        <label className="form-control w-full max-w-xs mt-2" key={amenity}>
                            <div className="label">
                                <span className="label-text text-gray-300">{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                            </div>
                            <input
                                type="checkbox"
                                name={amenity}
                                checked={amenities[amenity as keyof typeof amenities]}
                                onChange={handleChange(amenity)}
                                className="checkbox"
                            />
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-red-500">
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