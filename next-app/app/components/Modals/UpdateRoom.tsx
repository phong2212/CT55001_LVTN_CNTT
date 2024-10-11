'use client'

import { useGlobalState } from '@/app/hooks/useGlobalState';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Props {
    roomId: string;
}

function UpdateRoom({ roomId }: Props) {
    const { closeModal, allRooms } = useGlobalState();
    const [room, setRoom] = useState({
        hotelId: '',
        roomType: '',
        capacityAdults: 0,
        capacityChildren: 0,
        pricePerNight: 0,
        numberOfRooms: 0
    });

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`/api/rooms/${roomId}`);
                setRoom(response.data.room);
            } catch (error) {
                toast.error("Lỗi khi lấy thông tin phòng của khách sạn");
                console.error(error);
            }
        };

        fetchRoom();
    }, [roomId]);

    const handleChange = (name: keyof typeof room | string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;
            setRoom(prev => ({
                ...prev,
                [name]: name === 'roomType' || name === 'hotelId' ? value : parseFloat(value)
            }));
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
                min={type === 'number' ? '1' : undefined}
            />
        </label>
    );

    return (
        <form className='container px-20' onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl mb-8 text-center font-semibold leading-7">Chỉnh sửa phòng của khách sạn</h2>
                    {renderInput("hotelId", "ID Khách Sạn", room.hotelId, "hotelId")} 
                    {renderInput("roomType", "Loại Phòng", room.roomType, "roomType")} 
                    {renderInput("capacityAdults", "Số Người Lớn", room.capacityAdults, "capacityAdults", "number")} 
                    {renderInput("capacityChildren", "Số Trẻ Em", room.capacityChildren, "capacityChildren", "number")} 
                    {renderInput("pricePerNight", "Giá mỗi đêm", room.pricePerNight, "pricePerNight", "number")} 
                    {renderInput("numberOfRooms", "Số Phòng", room.numberOfRooms, "numberOfRooms", "number")}
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