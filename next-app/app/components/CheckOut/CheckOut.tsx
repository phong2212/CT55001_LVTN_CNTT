'use client'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import CheckOutPage from './CheckOutPage';
import { useState } from 'react';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined.")
}

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

interface Props {
    roomId: string;
    price: number;
}

interface Room {
    id: string;
    roomType: string;
    hotelId: string;
    capacityAdults: number;
    capacityChildren: number;
    pricePerNight: number;
}

export default function CheckOut({ roomId, price }: Props) {
    const { allRoom } = useGlobalState();
    const room = allRoom.find((r: Room) => r.id === roomId);

    const [FullName, setFullName] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Email, setEmail] = useState('');
    const [DateIn, setDateIn] = useState('');
    const [DateOut, setDateOut] = useState('');

    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        switch (name) {
            case 'FullName': 
                setFullName(value.trim()); 
                break;
            case 'PhoneNumber': 
                const numberValue = value.replace(/\D/g, '');
                setPhoneNumber(numberValue.slice(0, 10));
                break;
            case 'Email': 
                setEmail(value.trim()); 
                break;
               case 'DateIn': 
                setDateIn(value);
                if (DateOut && value > DateOut) {
                    setDateOut('');
                }
                break;
            case 'DateOut': 
                setDateOut(value); 
                break;
            default: break;
        }
    }

    const today = new Date().toISOString().split('T')[0];

    const reservationData = {
        roomId,
        FullName,
        PhoneNumber,
        Email,
        DateIn,
        DateOut
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">Thông tin phòng</h2>
                <div className="space-y-2">
                    <p><span className="font-semibold">Loại phòng:</span> {room?.roomType}</p>
                    <p>
                        <span className="font-semibold">Sức chứa:</span>
                        {room?.capacityAdults > 0 && ` ${room.capacityAdults} người lớn`}
                        {room?.capacityChildren > 0 && `, ${room.capacityChildren} trẻ em`}
                    </p>
                    <p><span className="font-semibold">Giá mỗi đêm:</span> {price.toLocaleString('vi-VN')}đ</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-6">Nhập thông tin đặt phòng</h2>
                    <div className="space-y-4">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Tên người đặt phòng</span>
                            </div>
                            <input
                                type="text"
                                value={FullName}
                                onChange={handleChange('FullName')}
                                className="input input-bordered w-full"
                                placeholder="Nhập tên người đăng ký..."
                            />
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Số điện thoại</span>
                            </div>
                            <input
                                type="tel"
                                value={PhoneNumber}
                                onChange={handleChange('PhoneNumber')}
                                className="input input-bordered w-full"
                                placeholder="Nhập số điện thoại..."
                                maxLength={10}
                            />
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Email</span>
                            </div>
                            <input
                                type="Email"
                                value={Email}
                                onChange={handleChange('Email')}
                                className="input input-bordered w-full"
                                placeholder="Nhập Email..."
                            />
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Ngày nhận phòng</span>
                            </div>
                            <input
                                type="date"
                                value={DateIn}
                                onChange={handleChange('DateIn')}
                                className="input input-bordered w-full"
                                min={today}
                            />
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Ngày trả phòng</span>
                            </div>
                            <input
                                type="date"
                                value={DateOut}
                                onChange={handleChange('DateOut')}
                                className="input input-bordered w-full"
                                min={DateIn || today}
                            />
                        </label>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-6">Thanh toán</h2>
                    <Elements
                        stripe={stripePromise}
                        options={{
                            mode: "payment",
                            amount: price,
                            currency: "vnd"
                        }}
                    >
                        <CheckOutPage 
                            amount={price} 
                            reservationData={reservationData}
                        />
                    </Elements>
                </div>
            </div>
        </div>
    );
}
