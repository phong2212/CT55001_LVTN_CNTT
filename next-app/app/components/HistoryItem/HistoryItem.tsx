import { useGlobalState } from '@/app/hooks/useGlobalState';
import React from 'react';

interface Props {
    id: string;
    room: string;
    FullName: string;
    PhoneNumber: string;
    Email: string;
    DateIn: string;
    DateOut: string;
    Status: boolean;
}

function HistoryItem({ id, room, FullName, PhoneNumber, Email, DateIn, DateOut, Status}: Props) {

    return (
        <>
            <tr>
                <td>{room}</td>
                <td>{FullName}</td>
                <td>{PhoneNumber}</td>
                <td>{Email}</td>
                <td>{DateIn}</td>
                <td>{DateOut}</td>
                <td className='text-center'>
                <button 
                        className={`btn ${Status ? 'btn-success' : 'btn-warning'}`} 
                    >
                        {Status ? 'Hoàn tất' : 'Đang xử lí'}
                    </button>
                </td>
            </tr>
        </>
    );
}

export default HistoryItem;
