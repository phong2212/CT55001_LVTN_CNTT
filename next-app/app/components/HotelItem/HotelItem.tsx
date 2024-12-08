import { useGlobalState } from '@/app/hooks/useGlobalState';
import { trash, edit } from '@/app/utils/Icons';
import React, { useState } from 'react';
import UpdateHotel from '../Modals/UpdateHotel';

interface Props {
    id: string;
    name: string;
    location: string;
    city: string;
    rating: number;
    description: string;
    amenities: {
        wifi: boolean;
        pool: boolean;
        gym: boolean;
    };
    createdAt: string;
    updatedAt: string;
}

function HotelItem({ id, name, location, city, rating, description, amenities, createdAt, updatedAt }: Props) {
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const { deleteHotel } = useGlobalState();

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
        deleteHotel(id);
        CloseDelete();
    };

    return (
        <>
            <tr>
                <td>{name}</td>
                <td>{location}</td>
                <td>{city}</td>
                <td>{rating} ⭐</td>
                <td>{description || 'chưa thêm'}</td>
                <td>{amenities.wifi ? 'Có' : 'Không'}</td>
                <td>{amenities.pool ? 'Có' : 'Không'}</td>
                <td>{amenities.gym ? 'Có' : 'Không'}</td>
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
            {isEdit || isDelete ? (
                <div className="modal modal-open">
                    <div className='absolute top-0 left-0 w-full h-screen blur' onClick={CloseEdit}></div>
                    <div className="modal-box max-w-5xl">
                        {isEdit ? (
                            <>
                                <UpdateHotel hotelId={id} />
                                <div className='absolute top-[32.8rem] left-[51.6rem]'>
                                    <button className="text-sm font-semibold leading-6 text-red-500" onClick={CloseEdit}>
                                        Hủy
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="font-bold text-lg text-center">CẢNH BÁO!</h3>
                                <p className="py-4 text-center">Bạn có chắc là Xóa khách sạn này và các phòng liên quan không ?</p>
                                <div className="modal-action">
                                    <button className="btn btn-md btn-success" onClick={handleDelete}>Đồng ý</button>
                                    <button className="btn btn-md btn-error" onClick={CloseDelete}>Hủy</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default HotelItem;
