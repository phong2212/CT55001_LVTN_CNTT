'use client'

import { useGlobalState } from '@/app/hooks/useGlobalState';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function CreateHotel() {
    const { all, allHotels, closeModal } = useGlobalState();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [city, setCity] = useState('');
    const [rating, setRating] = useState(0.0);
    const [description, setDescription] = useState('');
    const [amenities, setAmenities] = useState({ wifi: false, pool: false, gym: false });

    const handleChange = (name: keyof typeof amenities | string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
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
                <span className="label-text ">{label}</span>
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
                allHotels();
                all();
                closeModal();
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
                    <h2 className="text-2xl mb-8 text-center font-semibold leading-7">Tạo khách sạn mới</h2>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            {renderInput("name", "Tên khách sạn", name, "name")}
                            {renderInput("location", "Địa chỉ khách sạn", location, "location")}
                            {renderInput("city", "Tên thành phố", city, "city")}
                        </div>

                        <div>
                            {renderInput("rating", "Điểm rating", rating, "rating", "number")}
                            <label className='form-control w-full max-w-xs mt-2'>
                                <div className="label">
                                    <span className="label-text">Mô tả</span>
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
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Tiện nghi</h3>
                                <div className="flex gap-4">
                                    {['wifi', 'pool', 'gym'].map((amenity) => (
                                        <label className="form-control" key={amenity}>
                                            <div className="label">
                                                <span className="label-text">{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
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
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-red-500" onClick={closeModal}>
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

export default CreateHotel;