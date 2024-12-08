import { useGlobalState } from '@/app/hooks/useGlobalState';
import { trash, edit } from '@/app/utils/Icons';
import React, { useState } from 'react';
import UpdateRoom from '../Modals/UpdateRoom';

interface Props {
    id: string;
    hotel: string;
    roomType: string;
    capacityAdults: number;
    capacityChildren: number;
    pricePerNight: number;
    createdAt: string;
    updatedAt: string;
}

function UserItem({ id, hotel, roomType, capacityAdults, capacityChildren, pricePerNight, createdAt, updatedAt}: Props) {
    const [modalType, setModalType] = useState<null | 'edit' | 'delete'>(null);
    const { deleteRoom } = useGlobalState();

    const openModal = (type: 'edit' | 'delete') => {
        setModalType(type);
    };
    
    const closeModal = () => {
        setModalType(null);
    };

    const handleDelete = () => {
        deleteRoom(id);
        closeModal();
    };

    return (
        <>
            <tr>
                <td>{hotel}</td>
                <td>{roomType}</td>
                <td>{capacityAdults}</td>
                <td>{capacityChildren}</td>
                <td>{pricePerNight}</td>
                <td>{createdAt}</td>
                <td>{updatedAt}</td>
                <td className="border border-gray-300 p-2 text-center">
                    <button className="btn btn-warning text-white" onClick={() => openModal('edit')}>
                        {edit}
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
                    <div className="modal-box max-w-5xl">
                        {modalType === 'edit' ? (
                            <>
                                <UpdateRoom roomId={id} />
                                <div className='absolute top-[25.9rem] left-[51.6rem]'>
                                    <button className="text-sm font-semibold leading-6 text-red-500" onClick={closeModal}>
                                        Hủy
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="font-bold text-lg text-center">CẢNH BÁO!</h3>
                                <p className="py-4 text-center">Bạn có chắc là xóa phòng của khách sạn này không?</p>
                                <div className="modal-action">
                                    <button className="btn btn-md btn-success" onClick={handleDelete}>Đồng ý</button>
                                    <button className="btn btn-md btn-error" onClick={closeModal}>Hủy</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default UserItem;
