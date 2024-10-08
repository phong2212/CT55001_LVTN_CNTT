import { useGlobalState } from '@/app/hooks/useGlobalState';
import { trash, edit } from '@/app/utils/Icons';
import Image from 'next/image';
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

function UserItem({ id, name, location, city, rating, description,amenities, createdAt, updatedAt}: Props) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const { deleteHotel } = useGlobalState();

    const ImageClick = () => {
        setIsZoomed(true);
    };

    const CloseZoom = () => {
        setIsZoomed(false);
    };

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
                {/* <td className="border border-gray-300 p-2 text-center">
                    <div className="avatar cursor-pointer">
                        <div className="w-16 h-16 rounded-full mx-auto">
                            <Image
                                width={800}
                                height={800}
                                src={photo}
                                alt={'Ảnh của ' + location + ' ' + city}
                                onClick={ImageClick}
                            />
                        </div>
                    </div>
                </td> */}
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
            {/* {isZoomed && (
                <div className="modal modal-open">
                    <div className="modal-box text-center">
                        <Image
                            width={1600}
                            height={1600}
                            src={photo} alt={'Phóng to ảnh của ' + location + ' ' + city}
                            className="max-w-full h-auto" />
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={CloseZoom}>Đóng</button>
                        </div>
                    </div>
                </div>
            )} */}
             {isEdit && <div className="modal modal-open">
                <div className='absolute top-0 left-0 w-full h-screen blur' onClick={CloseEdit}></div>
                    <div className="modal-box">
                    <UpdateHotel hotelId={id} />
                        <div className='absolute top-[48.8rem] left-[18.6rem]'>
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
                        <p className="py-4">Bạn có chắc là xóa khách sạn này không ?</p>
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