import { useGlobalState } from '@/app/hooks/useGlobalState';
import { trash } from '@/app/utils/Icons';
import Image from 'next/image';
import React, { useState } from 'react';

interface Props {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    createdAt: Date;
    photo: string;
}

function UserItem({ id, email, firstname, lastname, createdAt, photo }: Props) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const { deleteUser } = useGlobalState();

    const ImageClick = () => {
        setIsZoomed(true);
    };

    const CloseZoom = () => {
        setIsZoomed(false);
    };

    const OpenDelete = () => {
        setIsDelete(true);
    };

    const CloseDelete = () => {
        setIsDelete(false);
    };

    const handleDelete = () => {
        deleteUser(id);
        CloseDelete(); // Close the delete modal after deletion
    };

    const formattedCreatedAt = createdAt.toLocaleString();

    return (
        <>
            <tr>
                <td>{email}</td>
                <td>{firstname || "chưa thêm"}</td>
                <td>{lastname || "chưa thêm"}</td>
                <td>{formattedCreatedAt}</td>
                <td className="border border-gray-300 p-2 text-center">
                    <div className="avatar cursor-pointer"> {/* Added cursor-pointer class */}
                        <div className="w-16 h-16 rounded-full mx-auto">
                            <Image
                                width={800}
                                height={800}
                                src={photo}
                                alt={'Ảnh của ' + firstname + ' ' + lastname}
                                onClick={ImageClick}
                            />
                        </div>
                    </div>
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
                            src={photo} alt={'Phóng to ảnh của ' + firstname + ' ' + lastname}
                            className="max-w-full h-auto" />
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={CloseZoom}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
            {isDelete && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">CẢNH BÁO!</h3>
                        <p className="py-4">Bạn có chắc là xóa tài khoản này không ?</p>
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