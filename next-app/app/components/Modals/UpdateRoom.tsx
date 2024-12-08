'use client'

import { useGlobalState } from '@/app/hooks/useGlobalState';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Props {
    roomId: string;
}

interface Hotels {
    id: string;
    name: string;
}

function UpdateRoom({ roomId }: Props) {
    const { all, closeModal, allRooms, allHotel } = useGlobalState();
    const [room, setRoom] = useState({
        hotelId: '',
        roomType: '',
        capacityAdults: 0,
        capacityChildren: 0,
        pricePerNight: 0,
    });
    const [hotelName, setHotelName] = useState('');
    const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const { data } = await axios.get(`/api/rooms/${roomId}`);
                setRoom(data.room);
                const hotel = allHotel.find((hotel: Hotels) => hotel.id === data.room.hotelId);
                setHotelName(hotel?.name || '');
            } catch (error) {
                toast.error("Lỗi khi lấy thông tin phòng của khách sạn");
                console.error(error);
            }
        };

        fetchRoom();
    }, [roomId, allHotel]);

    const fetchHotelSuggestions = async (searchTerm: string) => {
        if (searchTerm) {
            const res = await axios.get(`/api/hotels?search=${searchTerm}`);
            setSuggestions(res.data.searching || []);
        } else {
            setSuggestions([]);
        }
    };

    const handleChange = (name: keyof typeof room | string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;
        setRoom(prev => ({
            ...prev,
            [name]: name === 'roomType' || name === 'hotelId' ? value : parseFloat(value)
        }));
        if (name === 'hotelName') {
            setHotelName(value);
            fetchHotelSuggestions(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await axios.put(`/api/rooms/${roomId}`, {
                ...room,
            });

            if (res.data.error) {
                toast.error(res.data.error);
            } else {
                toast.success("Cập nhật phòng của khách sạn thành công!");
                allRooms();
                all();
                closeModal();
            }
        } catch (error) {
            toast.error("Cập nhật phòng của khách sạn thất bại!");
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
                min={type === 'number' ? '0' : undefined}
            />
        </label>
    );

    return (
        <form className='container px-20' onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl mb-8 text-center font-semibold leading-7">Chỉnh sửa phòng của khách sạn</h2>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        <div>
                            {renderInput("hotelName", "Tên Khách Sạn", hotelName, "hotelName")}
                            {hotelName && suggestions.length > 0 && (
                                <ul className="suggestions-list absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10 w-72">
                                    {suggestions.map(suggestion => (
                                        <li
                                            key={suggestion.id}
                                            onClick={() => {
                                                setHotelName(suggestion.name);
                                                setRoom(prev => ({ ...prev, hotelId: suggestion.id }));
                                                setSuggestions([]);
                                            }}
                                            className="p-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                            {suggestion.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {renderInput("roomType", "Loại Phòng", room.roomType, "roomType")}
                            {renderInput("capacityAdults", "Số Người Lớn", room.capacityAdults, "capacityAdults", "number")}
                        </div>
                        <div>
                            {renderInput("capacityChildren", "Số Trẻ Em", room.capacityChildren, "capacityChildren", "number")}
                            {renderInput("pricePerNight", "Giá mỗi đêm", room.pricePerNight, "pricePerNight", "number")}
                        </div>
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

export default UpdateRoom;
