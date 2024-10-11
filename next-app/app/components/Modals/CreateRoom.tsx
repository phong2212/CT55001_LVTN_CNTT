'use client'

import { useGlobalState } from '@/app/hooks/useGlobalState';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function CreateRoom() {
    const { allRooms, closeModal } = useGlobalState();
    const [formData, setFormData] = useState({
        hotelId: '',
        roomType: '',
        capacityAdults: 0,
        capacityChildren: 0,
        pricePerNight: 0,
        numberOfRooms: 1,
    });

    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/rooms", formData);
            if (res.data.error) {
                toast.error(res.data.error);
            } else {
                toast.success("Tạo phòng của phòng của khách sạn thành công!");
                allRooms();
                closeModal();
            }
        } catch (error) {
            toast.error("Tạo phòng của phòng của khách sạn thất bại!");
            console.error(error);
        }
    };

    return (
        <form className='container px-20' onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl mb-8 text-center font-semibold leading-7">Tạo phòng của phòng của khách sạn mới</h2>
                    {renderInput("hotelId", "ID Khách Sạn", formData.hotelId, "hotelId")} 
                    {renderInput("roomType", "Loại Phòng", formData.roomType, "roomType")} 
                    {renderInput("capacityAdults", "Số Người Lớn", formData.capacityAdults, "capacityAdults", "number")} 
                    {renderInput("capacityChildren", "Số Trẻ Em", formData.capacityChildren, "capacityChildren", "number")} 
                    {renderInput("pricePerNight", "Giá mỗi đêm", formData.pricePerNight, "pricePerNight", "number")} 
                    {renderInput("numberOfRooms", "Số Phòng", formData.numberOfRooms, "numberOfRooms", "number")}
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