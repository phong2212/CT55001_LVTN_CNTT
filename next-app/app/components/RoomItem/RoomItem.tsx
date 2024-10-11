import { useGlobalState } from '@/app/hooks/useGlobalState';
import { trash, edit } from '@/app/utils/Icons';
import React, { useState } from 'react';
import UpdateRoom from '../Modals/UpdateRoom';

interface Props {
    id: string;
    hotelId: string;
    roomType: string;
    capacityAdults: number;
    capacityChildren: number;
    pricePerNight: number;
    numberOfRooms: number;
    createdAt: string;
    updatedAt: string;
}

function UserItem({ id, hotelId, roomType, capacityAdults, capacityChildren, pricePerNight, numberOfRooms, createdAt, updatedAt}: Props) {
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const { deleteRoom } = useGlobalState();

    const OpenEdit = () => {
        setIsEdit(true);
      };
    
      const CloseEdit = () => {
        setIsEdit(false);
      };

    const OpenDelete = () => {
        setIsDelete(true);
    };

    const CloseDelete = () => {
        setIsDelete(false);
    };

    const handleDelete = () => {
        deleteRoom(id);
        CloseDelete();
    };

    return (
        <>
            <tr>
                <td>{hotelId}</td>
                <td>{roomType}</td>
                <td>{capacityAdults}</td>
                <td>{capacityChildren}</td>
                <td>{pricePerNight}</td>
                <td>{numberOfRooms}</td>
                <td>{createdAt}</td>
                <td>{updatedAt}</td>
                <td className="border border-gray-300 p-2 text-center">
                    <button className="btn btn-warning text-white" onClick={OpenEdit}>
                        {edit}
                    </button>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                    <button className="btn btn-error text-white" onClick={OpenDelete}>
                        {trash}
                    </button>
                </td>
            </tr>
             {isEdit && <div className="modal modal-open">
                <div className='absolute top-0 left-0 w-full h-screen blur' onClick={CloseEdit}></div>
                    <div className="modal-box">
                    <UpdateRoom roomId={id} />
                        <div className='absolute top-[44.4rem] left-[18.8rem]'>
                            <button className="text-sm font-semibold leading-6 text-red-500" onClick={CloseEdit}>
                            Hủy
                            </button>
                        </div>
                    </div>
                </div>}
            {isDelete && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">CẢNH BÁO!</h3>
                        <p className="py-4">Bạn có chắc là xóa phòng của khách sạnnày không ?</p>
                        <div className="modal-action">
                            <button className="btn btn-md btn-success" onClick={handleDelete}>Đồng ý</button>
                            <button className="btn btn-md btn-error" onClick={CloseDelete}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserItem;