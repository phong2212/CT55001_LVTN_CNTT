import { useGlobalState } from '@/app/hooks/useGlobalState';
import React from 'react';

interface Props {
    id: string;
    room: string;
    available: boolean;
}

function AvailabilityItem({ id, room, available}: Props) {
    const { updateAvailable } = useGlobalState();

    const handleButtonClick = () => {
        const data = {
            id,
            available: !available,
        };
        updateAvailable(data);
    };

    return (
        <>
            <tr>
                <td>{room}</td>
                <td className='text-center'>
                <button 
                        className={`btn ${available ? 'btn-success' : 'btn-warning'}`} 
                        onClick={handleButtonClick}
                    >
                        {available ? 'Sẵn sàng' : 'Đang xử lí'}
                    </button>
                </td>
            </tr>
        </>
    );
}

export default AvailabilityItem;
