'use client'

import React, { useState } from 'react'
import SearchBar from '../Search/SearchBar';
import SearchHotel from '../Search/SearchHotel';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import { star } from '@/app/utils/Icons';
import { ChatBox } from '../ChatBox/ChatBox';
import { KeenSliderOptions, useKeenSlider } from "keen-slider/react"
import 'keen-slider/keen-slider.min.css'
import { arrowLeft, arrowRight } from '@/app/utils/Icons';

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

function HomePage() {
    const { searchResult, random, isLoadingRandom, isLoadingLocation, allImg, location, hotelCity, locationHotel } = useGlobalState();
    const [loaded, setLoaded] = useState(false);

    React.useEffect(() => {
        if (hotelCity) {
            locationHotel(hotelCity);
        }
    }, [hotelCity]);

    const ksOptions: KeenSliderOptions = {
        initial: 0,
        loop: true,
        mode: "free-snap",
        slides: {
            perView: 3,
            spacing: 15,
        },
        created() {
            setLoaded(true);
        },
    }
    const [sliderRef, instanceRef] = useKeenSlider(ksOptions);

    React.useEffect(() => {
        instanceRef.current?.update(ksOptions);
    }, [location]);
    
    return (
        <div className='h-full caret-transparent'>
            <ChatBox />
            <div className="bg-primary h-72 caret-transparent relative">
                <div className="flex flex-col items-center justify-center">

                    <p className="text-5xl font-bold m-16 text-white">Tìm kiếm khách sạn tại đây</p>

                    <SearchBar />
                </div>
            </div>
            {searchResult && <SearchHotel />}



            {location.length > 0 && (
                <div className='bg-base-200 p-16 m-16 rounded-badge drop-shadow-lg mt-32'>
                    <div className='flex flex-row items-center'>
                        <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{star}</span>
                        <h1 className='text-3xl font-bold text-start text-sky-400'>
                            Khách sạn tại {hotelCity}
                        </h1>
                    </div>
                    {isLoadingLocation ? (
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="skeleton w-full h-52"></div>
                            <div className="skeleton w-full h-52"></div>
                            <div className="skeleton w-full h-52"></div>
                        </div>
                    ) : (
                        <div ref={sliderRef} className="keen-slider mt-8">
                            {location.map((hotel: Hotels) => {
                                const imgUrl = allImg.find((img: Imgs) => img.hotelId === hotel.id);
                                return (
                                    <a href={'/details/' + hotel.id} className="cursor-pointer">
                                        <div key={hotel.id} className={`keen-slider__slide`}>
                                            <img src={imgUrl ? `${imgUrl.imageUrl}` : 'Không tồn tại'} alt={imgUrl ? `${imgUrl.imageTitle}` : 'Không tồn tại'} className="w-full h-52 object-cover rounded-lg transition hover:opacity-70" />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white px-4 py-2 rounded-b-lg">
                                                <p className="text-xl font-semibold">{hotel.name}</p>
                                            </div>
                                        </div>
                                    </a>
                                )
                            })}
                            {loaded && instanceRef.current && (
                                <>
                                    <button
                                        onClick={() => instanceRef.current?.prev()}
                                        className='join-item btn btn-base-200 absolute top-[5.2rem] z-10 left-2'>
                                        {arrowLeft}
                                    </button>
                                    <button
                                        onClick={() => instanceRef.current?.next()}
                                        className='join-item btn btn-base-200 absolute top-[5.2rem] z-10 right-2'>
                                        {arrowRight}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className={`bg-base-200 p-16 m-16 rounded-badge drop-shadow-lg ${location.length === 0 ? 'mt-32' : ''}`}>
                <div className='flex flex-row justify-between items-center'>
                    <div className=' w-2/3'>
                        <div className='flex flex-row items-center'>
                            <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{star}</span>
                            <h1 className='text-3xl font-bold text-start text-sky-400'>
                                Một vài khách sạn bạn có thể thích
                            </h1>
                        </div>
                        <p className='mt-5 pr-40 text-justify'>
                            Khám phá những khách sạn mang đến trải nghiệm du lịch đa dạng và thú vị cho mọi người.
                        </p>
                    </div>
                </div>
                {isLoadingRandom ? (
                    < div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="skeleton w-full h-52"></div>
                        <div className="skeleton w-full h-52"></div>
                        <div className="skeleton w-full h-52"></div>
                        <div className="skeleton w-full h-52"></div>
                        <div className="skeleton w-full h-52"></div>
                        <div className="skeleton w-full h-52"></div>
                    </div>
                ) : (
                    < div className="grid grid-cols-3 gap-4 mt-8">
                        {random.map((random: Hotels) => {
                            const imgUrl = allImg.find((img: Imgs) => img.hotelId === random.id);
                            return (
                                <a href={'/details/' + random.id} className="cursor-pointer">
                                    <div key={random.id} className="relative hover:bg-black duration-300 hover:rounded-lg">
                                        <img src={imgUrl ? `${imgUrl.imageUrl}` : 'Không tồn tại'} alt={imgUrl ? `${imgUrl.imageTitle}` : 'Không tồn tại'} className="w-full h-52 object-cover rounded-lg transition  hover:opacity-70" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white px-4 py-2 rounded-b-lg">
                                            <p className="text-xl font-semibold">{random.name}</p>
                                        </div>
                                    </div>
                                </a>
                            )
                        })}
                    </div>
                )}
            </div>
        </div >
    )
}

export default HomePage