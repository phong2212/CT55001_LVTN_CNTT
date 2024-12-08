'use client'

import { useGlobalState } from '@/app/hooks/useGlobalState';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Props {
    imgId: string;
}

interface Imgs {
    id: string;
    hotelId: string;
    imageTitle: string;
    imageUrl: string;
}

interface Hotels {
    id: string;
    name: string;
}

function UpdateImg({ imgId }: Props) {
    const { closeModal, allImgs, allHotel } = useGlobalState();
    const [img, setImg] = useState({
        hotelId: '',
        imageTitle: '',
        imageUrl: '',
    });
    const [hotelName, setHotelName] = useState('');
    const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchImg = async () => {
            try {
                const { data } = await axios.get(`/api/upload/${imgId}`);
                setImg(data.img);
                const hotel = allHotel.find((hotel: Hotels) => hotel.id === data.img.hotelId);
                setHotelName(hotel?.name || '');
            } catch (error) {
                toast.error("Lỗi khi lấy thông tin ảnh");
                console.error(error);
            }
        };

        fetchImg();
    }, [imgId, allHotel]);

    const fetchHotelSuggestions = async (searchTerm: string) => {
        if (searchTerm) {
            const res = await axios.get(`/api/hotels?search=${searchTerm}`);
            setSuggestions(res.data.searching || []);
        } else {
            setSuggestions([]);
        }
    };

    const handleChange = (name: keyof typeof img | string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;
        setImg(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'hotelName') {
            setHotelName(value);
            fetchHotelSuggestions(value);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const fileType = selectedFile.type;
            const fileSize = selectedFile.size;

            if (!['image/png', 'image/jpeg'].includes(fileType)) {
                toast.error("Chỉ cho phép tải lên các tệp PNG hoặc JPG!");
                return;
            }

            if (fileSize > 15 * 1024 * 1024) {
                toast.error("Kích thước tệp không được vượt quá 15MB!");
                return;
            }

            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            toast.error("Vui lòng chọn một tệp hình ảnh!");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('upload_preset', 'HotelImageCloud');

        try {
             const uploadResponse = await axios.post(
                "https://api.cloudinary.com/v1_1/dtfwd3rcy/image/upload",
                formDataToSend
            );

            const imageUrl = await uploadResponse.data.secure_url;
            const data = { ...img, imageUrl };
            const res = await axios.put(`/api/upload/${imgId}`, {
                ...data,
            });

            if (res.data.error) {
                toast.error(res.data.error);
            } else {
                toast.success("Cập nhật ảnh thành công!");
                allImgs();
                closeModal();
            }
        } catch (error) {
            toast.error("Cập nhật ảnh thất bại!");
            console.error(error);
        }
    };

    const renderInput = (id: string, label: string, value: string | number, name: string, type: string = 'text') => (
        <label className="form-control w-full max-w-xs mt-2">
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
            <input
                type={type}
                id={id}
                value={value}
                name={name}
                onChange={handleChange(name)}
                className="input input-bordered w-full max-w-xs"
                placeholder={`Nhập ${label.toLowerCase()}...`}
            />
        </label>
    );

    return (
        <form className='container px-20' onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl mb-8 text-center font-semibold leading-7">Chỉnh sửa thông tin ảnh</h2>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="relative">
                                {renderInput("hotelName", "Tên Khách Sạn", hotelName, "hotelName")}
                                {hotelName && suggestions.length > 0 && (
                                    <ul className="suggestions-list absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10 w-72">
                                        {suggestions.map(suggestion => (
                                            <li
                                                key={suggestion.id}
                                                onClick={() => {
                                                    setHotelName(suggestion.name);
                                                    setImg(prev => ({ ...prev, hotelId: suggestion.id }));
                                                    setSuggestions([]);
                                                }}
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                            >
                                                {suggestion.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {renderInput("imageTitle", "Tên Hình ảnh", img.imageTitle, "imageTitle", "text")}
                            </div>
                        </div>
                        <div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Ảnh khách sạn</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H20V16H8V28H16V36H28V28H36V16H28V8Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>Tải lên tệp</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                            </label>
                                            <p className="pl-1">hoặc kéo và thả</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG lên đến 15MB</p>
                                    </div>
                                </div>
                                {previewUrl && (
                                    <div className="mt-4 relative">
                                        <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-md" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end gap-x-6">
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Lưu
                </button>
            </div>
        </form>
    )
}

export default UpdateImg;
