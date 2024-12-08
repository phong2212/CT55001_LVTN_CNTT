'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '../hooks/useGlobalState';


interface ReservationData {
    roomId: string;
    FullName: string;
    PhoneNumber: string;
    Email: string;
    DateIn: string;
    DateOut: string;
}

export default function PaymentSuccess({
    searchParams,
}: {
    searchParams: ReservationData & { amount: string };
}) {
    const { allReservations, all } = useGlobalState();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const createReservation = async () => {
            if (status !== 'loading') return;

            try {
                const reservationData: ReservationData = {
                    roomId: searchParams.roomId,
                    FullName: searchParams.FullName,
                    PhoneNumber: searchParams.PhoneNumber,
                    Email: searchParams.Email,
                    DateIn: searchParams.DateIn,
                    DateOut: searchParams.DateOut,
                };

                await axios.post('/api/reservation', reservationData);
                setStatus('success');

                allReservations();
                all();
            } catch (error) {
                console.error('Lỗi khi tạo đặt phòng:', error);
                setStatus('error');
                setErrorMessage('Có lỗi xảy ra khi xử lý đặt phòng. Vui lòng liên hệ hỗ trợ.');
            }
        };

        createReservation();
    }, [searchParams]);

    return (
        <main className=" h-screen mb-20 max-w-6xl mx-auto p-10 text-center">
            {status === 'loading' && (
                <div className="animate-pulse">
                    <h2 className="text-2xl">Đang xử lý đặt phòng...</h2>
                </div>
            )}

            {status === 'success' && (
                <div className="border m-10 rounded-md  bg-primary text-white p-10">
                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold mb-2">Cảm ơn bạn!</h1>
                        <h2 className="text-2xl">Đặt phòng thành công</h2>

                        <div className="bg-white p-2 rounded-md text-accent mt-5 text-4xl font-bold">
                            {parseInt(searchParams.amount).toLocaleString('vi-VN')} VNĐ
                        </div>

                        <div className="mt-8 space-y-4 text-left bg-white/20 p-6 rounded-lg">
                            <p><strong>Tên khách hàng:</strong> {searchParams.FullName}</p>
                            <p><strong>Email:</strong> {searchParams.Email}</p>
                            <p><strong>Số điện thoại:</strong> {searchParams.PhoneNumber}</p>
                            <p><strong>Ngày nhận phòng:</strong> {searchParams.DateIn}</p>
                            <p><strong>Ngày trả phòng:</strong> {searchParams.DateOut}</p>
                        </div>

                        <button
                            onClick={() => router.push('/')}
                            className="mt-8 bg-accent px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Trở về trang chủ
                        </button>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="border m-10 rounded-md bg-red-500 text-white p-10">
                    <h1 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h1>
                    <p>{errorMessage}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 bg-white text-red-500 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Trở về trang chủ
                    </button>
                </div>
            )}
        </main>
    );
}