import React, { useState } from 'react';
import { edit, trash } from '@/app/utils/Icons';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import UpdateContent from '../Modals/UpdateContent';

interface Props {
  id: string;
  name: string;
  description: string;
  continent: string;
  country: string;
  city: string;
  imageURL: string;
}

function DestItem({ id, name, description, continent, country, city, imageURL }: Props) {
  const { deleteDest } = useGlobalState();
  const [isZoomed, setIsZoomed] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);


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

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <>
      {isEdit && <div className="modal modal-open">
        <div className='absolute top-0 left-0 w-full h-screen blur' onClick={CloseEdit}></div>
        <div className="modal-box">
          <UpdateContent destinationId={id} />
          <div className='absolute top-[47.8rem] left-[18rem]'>
            <button className="text-sm font-semibold leading-6 text-red-500" onClick={CloseEdit}>
              Hủy
            </button>
          </div>
        </div>
      </div>}
      <tr>
        <td>{name}</td>
        <td>
          {showFullDescription || description.length <= 80 ? description : `${description.substring(0, 80)}...`}
          {description.length > 80 && (
            <button className='btn-link pl-1' onClick={toggleDescription}>
              {showFullDescription ? '[Thu gọn]' : '[Mở rộng]'}
            </button>
          )}
        </td>
        <td>{continent}</td>
        <td>{country}</td>
        <td>{city}</td>
        <td className="avatar cursor-pointer">
          <div className="w-24 rounded">
            <img
              src={imageURL}
              alt={'Ảnh của ' + name}
              onClick={ImageClick}
            />
          </div>
        </td>
        <td>
          <button className="btn glass m-1 text-yellow-500" onClick={OpenEdit}>{edit}</button>
          <button className="btn glass m-1 text-red-500" onClick={OpenDelete}>{trash}</button>
        </td>
      </tr>
      {isZoomed && (
        <div className="modal modal-open">
          <div className="modal-box">
            <img src={imageURL} alt={'Phóng to ảnh của ' + name} className="max-w-full h-auto" />
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
            <p className="py-4">Bạn có chắc là xóa địa điểm này không ?</p>
            <div className="modal-action">
              <button className="btn btn-md btn-success" onClick={() => {
                deleteDest(id);
              }}>Đồng ý</button>
              <button className="btn btn-md btn-error" onClick={CloseDelete}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DestItem;