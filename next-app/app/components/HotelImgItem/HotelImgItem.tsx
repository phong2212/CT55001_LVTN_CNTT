import { useGlobalState } from '@/app/hooks/useGlobalState';
import { trash, edit } from '@/app/utils/Icons';
import React, { useState } from 'react';
import Image from 'next/image';
import UpdateHotelImage from '../Modals/UpdateHotelImage';

interface Props {
    id: string;
    hotel: string;
    imageTitle: string;
    imageUrl: string;
}

function HotelImageItem({ id, hotel, imageTitle, imageUrl }: Props) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const { deleteImg } = useGlobalState();

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
        deleteImg(id);
        CloseDelete();
    };

    return (
        <>
            <tr>
                <td>{hotel}</td>
                <td>{imageTitle}</td>
                <td className="border border-gray-300 p-2 text-center">
                    <div className="avatar cursor-pointer"> 
                        <div className="w-48 h-48 mx-auto">
                            <Image
                                width={300}
                                height={300}
                                src={imageUrl}
                                alt={imageTitle}
                                onClick={ImageClick}
                            />
                        </div>
                    </div>
                </td>
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
            {isZoomed && (
                <div className="modal modal-open">
                    <div className="modal-box text-center">
                        <Image
                            width={1600}
                            height={1600}
                            src={imageUrl}
                            alt={imageTitle}
                            className="max-w-full h-auto" />
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={CloseZoom}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
            {isEdit || isDelete ? (
                <div className="modal modal-open">
                    <div className='absolute top-0 left-0 w-full h-screen blur' onClick={CloseEdit}></div>
                    <div className="modal-box">
                        {isEdit ? (
                            <>
                                <UpdateHotelImage imgId={id} />
                            </>
                        ) : (
                            <>
                                <h3 className="font-bold text-lg">CẢNH BÁO!</h3>
                                <p className="py-4">Bạn có chắc là xóa ảnh này không ?</p>
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

export default HotelImageItem;
