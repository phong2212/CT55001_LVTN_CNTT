import React, { useState, useEffect } from 'react';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import 'keen-slider/keen-slider.min.css';
import Carousel from '../Carousel/Carousel';
import { KeenSliderOptions, useKeenSlider } from 'keen-slider/react';
import { arrowLeft, arrowRight, poll } from '@/app/utils/Icons';
import axios from 'axios';

interface Hotels {
    id: string;
    name: string;
    location: string;
    distance?: number;
}

async function getCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { q: address, format: 'json', addressdetails: 1, limit: 1 },
    });

    if (response.data?.length) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
    return null;
}

async function getDistance(origin: { lng: any; lat: any; }, destination: { lat: any; lng: any; }) {
    const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`, {
        params: { overview: 'false', steps: false },
    });

    if (response.data.routes?.length) {
        return response.data.routes[0].distance / 1000;
    }
    console.error('Error fetching distance:', response.data);
    return null;
}

function SearchHotel() {
    const { searchHotels, isLoadingSearch, currentLocation } = useGlobalState();
    const [loaded, setLoaded] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [distances, setDistances] = useState<{ [key: string]: number }>({});

    const ksOptions: KeenSliderOptions = {
        initial: 0,
        loop: true,
        mode: 'free-snap',
        slides: { perView: 3, spacing: 15 },
        created: () => setLoaded(true),
    };
    const [sliderRef, instanceRef] = useKeenSlider(ksOptions);

    useEffect(() => {
        instanceRef.current?.update(ksOptions);
        setNoResults(searchHotels.length === 0 && !isLoadingSearch);
    }, [searchHotels, isLoadingSearch]);

    useEffect(() => {
        const calculateDistances = async () => {
            if (currentLocation) {
                const newDistances: { [key: string]: number } = {};
                for (const hotel of searchHotels) {
                    const hotelCoordinates = await getCoordinates(hotel.location);
                    if (hotelCoordinates) {
                        const distance = await getDistance(currentLocation, hotelCoordinates);
                        if (distance !== null) newDistances[hotel.id] = distance;
                    }
                }
                setDistances(newDistances);
            }
        };
        calculateDistances();
    }, [currentLocation, searchHotels]);

    const sortedHotels = searchHotels.sort((a: { id: string | number; }, b: { id: string | number; }) => (distances[a.id] || Infinity) - (distances[b.id] || Infinity));

    return (
        <div className='bg-base-200 px-16 py-12 my-16 mx-36 rounded-badge drop-shadow-lg'>
            <div className='flex flex-row justify-between items-center'>
                <div>
                    <div className='flex flex-row items-center'>
                        <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{poll}</span>
                        <h1 className='text-3xl font-bold text-start text-sky-400'>Kết quả tìm kiếm:</h1>
                    </div>
                </div>
            </div>
            {noResults ? (
                <p className="text-red-500 text-2xl mt-8">Không tìm thấy khách sạn!</p>
            ) : isLoadingSearch ? (
                <div ref={sliderRef} className="keen-slider mt-8">
                    <div className='keen-slider__slide number-slide1 skeleton w-32 h-52'></div>
                    <div className='keen-slider__slide number-slide2 skeleton w-32 h-52'></div>
                    <div className='keen-slider__slide number-slide3 skeleton w-32 h-52'></div>
                    <div className='keen-slider__slide number-slide4 skeleton w-32 h-52'></div>
                </div>
            ) : (
                <div ref={sliderRef} className='keen-slider mt-8 flex flex-row relative overflow-hidden'>
                    {sortedHotels.map((search: Hotels, index: number) => (
                        <div key={index} className={`keen-slider__slide number-slide${index + 1}`}>
                            <Carousel key={search.id} id={search.id} name={search.name} distance={distances[search.id]} />
                        </div>
                    ))}
                    {loaded && instanceRef.current && (
                        <>
                            <button onClick={() => instanceRef.current?.prev()} className='join-item btn btn-base-200 absolute top-[5.2rem] z-10 left-2'>{arrowLeft}</button>
                            <button onClick={() => instanceRef.current?.next()} className='join-item btn btn-base-200 absolute top-[5.2rem] z-10 right-2'>{arrowRight}</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchHotel;