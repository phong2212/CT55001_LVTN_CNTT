import { useGlobalState } from '@/app/hooks/useGlobalState';
import { trash, edit, status } from '@/app/utils/Icons';
import React, { useState } from 'react';

interface Props {
    id: string;
    room: string;
    user: string;
    FullName: string;
    PhoneNumber: string;
    Email: string;
    Status: boolean;
    DateIn: string;
    DateOut: string;
}

function UserItem({ id, room, user, FullName, PhoneNumber, Email, Status, DateIn, DateOut }: Props) {
    const [modalType, setModalType] = useState<null | 'delete'>(null);
    const { deleteReservation, updateStatus } = useGlobalState();

    const openModal = (type: 'delete') => {
        setModalType(type);
    };

    const closeModal = () => {
        setModalType(null);
    };

    const handleButtonClick = () => {
        const data = {
            id,
            Status: !Status,
        };
        console.log(data);
        updateStatus(data);
    };

    const handleDelete = () => {
        deleteReservation(id);
        closeModal();
    };

    return (
        <>
            <tr>
                <td>{room}</td>
                <td>{user}</td>
                <td>{FullName}</td>
                <td>{PhoneNumber}</td>
                <td>{Email}</td>
                <td>{DateIn}</td>
                <td>{DateOut}</td>
                <td>
                <button 
                        className={`btn ${Status ? 'btn-success' : 'btn-warning'}`} 
                        onClick={handleButtonClick}
                    >
                        {Status ? 'Đã duyệt' : 'Đang xử lí'}
                    </button>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                    <button className="btn btn-error text-white" onClick={() => openModal('delete')}>
                        {trash}
                    </button>
                </td>
            </tr>
            {modalType && (
                <div className="modal modal-open">
                    <div className='absolute top-0 left-0 w-full h-screen blur' onClick={closeModal}></div>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">CẢNH BÁO!</h3>
                        <p className="py-4">Bạn có chắc là xóa phòng của khách sạn này không?</p>
                        <div className="modal-action">
                            <button className="btn btn-md btn-success" onClick={handleDelete}>Đồng ý</button>
                            <button className="btn btn-md btn-error" onClick={closeModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserItem;
