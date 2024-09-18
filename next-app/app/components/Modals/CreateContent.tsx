'use client'

import { useGlobalState } from '@/app/context/globalProvider';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function CreateContent() {
    const { allDests, closeModal } = useGlobalState();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [continent, setContinent] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [imageURL, setImageURL] = useState('');

    const handleChange = (name: string) => (e: any) => {
        switch (name) {
            case 'name':
                setName(e.target.value);
                break;
            case 'description':
                setDescription(e.target.value);
                break;
            case 'continent':
                setContinent(e.target.value);
                break;
            case 'country':
                setCountry(e.target.value);
                break;
            case 'city':
                setCity(e.target.value);
                break;
            case 'imageURL':
                setImageURL(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const destinations = {
            name,
            description,
            continent,
            country,
            city,
            imageURL
        };

        try {
            const res = await axios.post("/api/destinations", destinations);

            if (res.data.error) {
                toast.error(res.data.error);
            }

            if (!res.data.error) {
                toast.success("Tạo địa điểm thành công!");
                allDests();
                closeModal();
            }
        } catch (error) {
            toast.error("Tạo địa điểm thất bại!");
            console.error(error);
        }
    }

    return (
        <form className='container px-20 caret-transparent' onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl mb-8 text-center font-semibold leading-7 text-gray-100">Tạo địa điểm mới</h2>
                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Tên địa điểm</span>
                        </div>
                        <input
                            type="text"
                            id="tittle"
                            value={name}
                            name="name"
                            onChange={handleChange("name")}
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Nhập tên địa điểm..."
                        />
                    </label>
                    <label className=' form-control w-full max-w-xs mt-2'>
                        <div className="label">
                            <span className="label-text text-gray-300 ">Mô tả</span>
                        </div>
                        <textarea
                            id="tittle"
                            value={description}
                            name="description"
                            onChange={handleChange("description")}
                            className="textarea textarea-bordered flex items-center "
                            placeholder="Nhập mô tả..."
                            rows={4}
                        />
                    </label>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Tên châu lục</span>
                        </div>
                        <select
                            className="select select-bordered w-full max-w-xs"
                            id="continent"
                            name="continent"
                            value={continent}
                            onChange={handleChange("continent")}
                        >
                            <option disabled value="">Chọn châu lục</option>
                            <option value="Châu Á">Châu Á</option>
                            <option value="Châu Âu">Châu Âu</option>
                            <option value="Châu Mỹ">Châu Mỹ</option>
                            <option value="Châu Đại Dương">Châu Đại Dương</option>
                            <option value="Châu Phi">Châu Phi</option>
                        </select>
                    </label>


                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Tên quốc gia</span>
                        </div>
                        <input
                            type="text"
                            id="country"
                            value={country}
                            name="country"
                            onChange={handleChange("country")}
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Nhập tên quốc gia..."
                        />
                    </label>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Tên thành phố</span>
                        </div>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            name="city"
                            onChange={handleChange("city")}
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Nhập thành phố..."
                        />
                    </label>


                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-gray-300">Link ảnh</span>
                        </div>
                        <input
                            type="text"
                            id="imageURL"
                            value={imageURL}
                            name="imageURL"
                            onChange={handleChange("imageURL")}
                            className="input input-bordered w-full max-w-xs"
                            placeholder="Nhập link ảnh..."
                        />
                    </label>


                </div>
            </div>
            <div className="flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-red-500" onClick={closeModal}>
                    Hủy
                </button>
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

export default CreateContent;