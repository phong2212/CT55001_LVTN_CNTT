'use client'

import { useGlobalState } from '@/app/hooks/useGlobalState';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function CreateRoom() {
    const { all, allRooms, allAvailabilities, closeModal } = useGlobalState();
    const [formData, setFormData] = useState({
        hotelId: '',
        roomType: '',
        capacityAdults: 0,
        capacityChildren: 0,
        pricePerNight: 0,
    });
    const [hotelName, setHotelName] = useState('');
    const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);


    const fetchHotelSuggestions = async (searchTerm: string) => {
        if (searchTerm) {
            const res = await axios.get(`/api/hotels?search=${searchTerm}`);
            setSuggestions(res.data.searching || []);
        } else {
            setSuggestions([]);
        }
    };

    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
        if (name === 'hotelName') {
            setHotelName(value);
            fetchHotelSuggestions(value);
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
                min={type === 'number' ? '0' : undefined}
            />
        </label>
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/rooms", formData);
            if (res.data.error) {
                toast.error(res.data.error);
            } else {
                toast.success("Tạo phòng của phòng thành công!");
                allRooms();
                allAvailabilities();
                all();
                closeModal();
            }
        } catch (error) {
            toast.error("Tạo phòng của phòng thất bại!");
            console.error(error);
        }
    };

    return (
        <form className='container px-20' onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl mb-8 text-center font-semibold leading-7">Tạo phòng mới</h2>
                    <div className="grid grid-cols-2 gap-x-8">
                        {/* Cột trái */}
                        <div>
                            <div className="relative">
                                {renderInput("hotelName", "Tên Khách Sạn", hotelName, "hotelName", "text")}

                                {hotelName && suggestions.length > 0 && (
                                    <ul className="suggestions-list absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10 w-full">
                                        {suggestions.map(suggestion => (
                                            <li 
                                                key={suggestion.id} 
                                                onClick={() => {
                                                    setHotelName(suggestion.name); 
                                                    setFormData(prev => ({ ...prev, hotelId: suggestion.id }));
                                                    setSuggestions([]);
                                                }}
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                            >
                                                {suggestion.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {renderInput("roomType", "Loại Phòng", formData.roomType, "roomType")} 
                            {renderInput("capacityAdults", "Số Người Lớn", formData.capacityAdults, "capacityAdults", "number")} 
                        </div>

                        {/* Cột phải */}
                        <div>
                            {renderInput("capacityChildren", "Số Trẻ Em", formData.capacityChildren, "capacityChildren", "number")} 
                            {renderInput("pricePerNight", "Giá mỗi đêm", formData.pricePerNight, "pricePerNight", "number")} 
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

export default CreateRoom;
