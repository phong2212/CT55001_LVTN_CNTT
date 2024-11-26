import React, { useState, useEffect } from 'react';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import 'keen-slider/keen-slider.min.css';
import { poll } from '@/app/utils/Icons';

interface Hotels {
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
    distance?: number;
}

interface Imgs {
    id: string;
    hotelId: string;
    imageTitle: string;
    imageUrl: string;
}

function SearchHotel() {
    const { searchHotels, isLoadingSearch, currentLocation, allImg, getCoordinates, getDistance } = useGlobalState();
    const [noResults, setNoResults] = useState(false);
    const [distances, setDistances] = useState<{ [key: string]: number }>({});
    const [sortOption, setSortOption] = useState<string | null>(null);

    useEffect(() => {
        if (searchHotels.length === 0 && !isLoadingSearch) {
            setNoResults(true);
        } else {
            setNoResults(false);
        }
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

    const sortedHotels = () => {
        if (!sortOption) return searchHotels;
        return [...searchHotels].sort((a: Hotels, b: Hotels) => {
            if (sortOption === 'name') {
                return a.name.localeCompare(b.name);
            }
            if (sortOption === 'distance' && Object.keys(distances).length > 0) {
                return (distances[a.id] || Infinity) - (distances[b.id] || Infinity);
            }
            return 0;
        });
    };

    return (
        <div className='bg-base-200 px-16 py-12 my-16 mx-36 rounded-badge drop-shadow-lg mt-32'>
            <div className='flex flex-row justify-between items-center'>
                <div>
                    <div className='flex flex-row items-center'>
                        <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{poll}</span>
                        <h1 className='text-3xl font-bold text-start text-sky-400'>Kết quả tìm kiếm:</h1>
                    </div>
                </div>
                <div className='flex space-x-4'>
                    <button className='btn' onClick={() => setSortOption('name')}>Sắp xếp theo chữ cái</button>
                    {currentLocation && Object.keys(distances).length > 0 && (
                        <button className='btn' onClick={() => setSortOption('distance')}>Sắp xếp theo khoảng cách</button>
                    )}
                </div>
            </div>
            {noResults ? (
                <p className="text-red-500 text-2xl mt-8">Không tìm thấy khách sạn!</p>
            ) : (isLoadingSearch || (currentLocation && Object.keys(distances).length === 0)) ? (
                <div className="mt-8">
                    <div className='skeleton mt-8 w-full h-56'></div>
                    <div className='skeleton mt-8 w-full h-56'></div>
                    <div className='skeleton mt-8 w-full h-56'></div>
                    <div className='skeleton mt-8 w-full h-56'></div>
                </div>
            ) : (
                <div className='mt-8 flex flex-col space-y-4'>
                     {sortedHotels().map((search: Hotels, index: number) => {
                        const imgUrl = allImg.find((img: Imgs) => img.hotelId === search.id);
                        return (
                        distances[search.id] !== null && (
                            <div key={index} className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex'>
                                <img 
                                    src={imgUrl ? `${imgUrl.imageUrl}` : 'Không tồn tại'} 
                                    alt={imgUrl ? `${imgUrl.imageTitle}` : 'Không tồn tại'}
                                    width={300}
                                    height={300}
                                    className='rounded-lg mr-4'
                                />
                                <div className='flex flex-col flex-grow'>
                                    <a href="#" className='text-xl font-semibold text-sky-500 hover:text-sky-700 transition-colors'>{search.name}</a>
                                    <p>
                                        {search.city}  
                                        {currentLocation && distances[search.id] !== undefined 
                                            ? ` - cách xa tầm ${Math.ceil(distances[search.id] * 10) / 10} km` 
                                            : ''}
                                    </p>
                                    <div className='flex items-center'>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-yellow-500 ${i < search.rating ? 'fas fa-star' : 'far fa-star'}`}></span>
                                        ))}
                                    </div>
                                    <p>{search.description}</p>
                                    <div className='flex justify-between items-center mt-20'>
                                        <button 
                                            className='btn btn-primary'
                                            onClick={() => window.open(`https://www.openstreetmap.org/search?query=${encodeURIComponent(search.location)}`, '_blank')}
                                        >
                                            Xem bản đồ
                                        </button>
                                        <a href={`/details/` + search.id} className='btn btn-secondary'>Xem chi tiết</a>
                                    </div>

                                </div>
                            </div>
                        )
                    )})}
                </div>
            )}
        </div>
    );
}

export default SearchHotel;