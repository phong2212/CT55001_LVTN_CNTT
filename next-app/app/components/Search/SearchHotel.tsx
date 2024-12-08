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

interface Rooms {
    id: string;
    hotelId: string;
    roomType: string;
    capacityAdults: number;
    capacityChildren: number;
    pricePerNight: number;

}

interface Availabilities {
    id: string;
    roomId: string;
    available: boolean;
}

function SearchHotel() {
    const { searchHotels, isLoadingSearch, currentLocation, allImg, getCoordinates, getDistance, allRoom, allavailable } = useGlobalState();
    const [noResults, setNoResults] = useState(false);
    const [distances, setDistances] = useState<{ [key: string]: number }>({});
    const [sortOption, setSortOption] = useState<string | null>(null);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(50000000);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [hasRatingInteraction, setHasRatingInteraction] = useState<boolean>(false);
    const [amenities, setAmenities] = useState({
        wifi: false,
        pool: false,
        gym: false,
    });

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

    const formatCurrency = (value: number) => {
       return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
    };

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value.replace(/\D/g, '')), maxPrice);
        setMinPrice(value);
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value.replace(/\D/g, '')), minPrice);
        setMaxPrice(value);
    };

    const handleRatingChange = (rating: number) => {
        if (rating === selectedRating && hasRatingInteraction) {
            setSelectedRating(0);
            setHasRatingInteraction(false);
        } else {
            setSelectedRating(rating);
            setHasRatingInteraction(true);
        }
    };

    const handleAmenityChange = (amenity: 'wifi' | 'pool' | 'gym') => {
        setAmenities((prev) => ({
            ...prev,
            [amenity]: !prev[amenity],
        }));
    };

    const resetFilters = () => {
        setMinPrice(0);
        setMaxPrice(50000000);
        setSelectedRating(0);
        setHasRatingInteraction(false);
        setAmenities({
            wifi: false,
            pool: false,
            gym: false,
        });
    };

    const sortedHotels = () => {
        let filteredHotels = searchHotels;

        if (hasRatingInteraction && selectedRating > 0) {
            filteredHotels = filteredHotels.filter((hotel: Hotels) => 
                hotel.rating === selectedRating
            );
        }

        if (amenities.wifi || amenities.pool || amenities.gym) {
            filteredHotels = filteredHotels.filter((hotel: Hotels) => {
                if (amenities.wifi && !hotel.amenities.wifi) return false;
                if (amenities.pool && !hotel.amenities.pool) return false;
                if (amenities.gym && !hotel.amenities.gym) return false;
                return true;
            });
        }

        filteredHotels = filteredHotels.filter((hotel: Hotels) => {
            const availableRooms = allRoom
                .filter((room: Rooms) => room.hotelId === hotel.id)
                .filter((room: Rooms) => {
                    const availability = allavailable.find(
                        (avail: Availabilities) => avail.roomId === room.id
                    );
                    return availability ? availability.available : false;
                });

            if (availableRooms.length === 0) return false;

            const cheapestPrice = Math.min(
                ...availableRooms.map((room: Rooms) => room.pricePerNight)
            );
            
            return cheapestPrice >= minPrice && cheapestPrice <= maxPrice;
        });

        if (!sortOption) return filteredHotels;
        
        return [...filteredHotels].sort((a: Hotels, b: Hotels) => {
            if (sortOption === 'name') {
                return a.name.localeCompare(b.name);
            }
            if (sortOption === 'distance' && Object.keys(distances).length > 0) {
                return (distances[a.id] || Infinity) - (distances[b.id] || Infinity);
            }
            if (sortOption === 'cheapest') {
                const getCheapestRoomPrice = (hotel: Hotels) => {
                    const availableRooms = allRoom
                        .filter((room: Rooms) => room.hotelId === hotel.id)
                        .filter((room: Rooms) => {
                            const availability = allavailable.find((avail: Availabilities) => avail.roomId === room.id);
                            return availability ? availability.available : false;
                        });
                    const cheapestRoom = availableRooms.reduce((prev: Rooms, curr: Rooms) => {
                        return prev.pricePerNight < curr.pricePerNight ? prev : curr;
                    }, availableRooms[0]);
                    return cheapestRoom ? cheapestRoom.pricePerNight : Infinity;
                };
                return getCheapestRoomPrice(a) - getCheapestRoomPrice(b);
            }
            return 0;
        });
    };

    return (
        <div className='bg-base-200 px-8 py-8 my-16 mx-36 rounded-badge drop-shadow-lg mt-32'>
            <div className='flex flex-row justify-between items-center mb-4'>
                <div className='flex flex-row items-center'>
                    <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{poll}</span>
                    <h1 className='text-3xl font-bold text-start text-sky-400'>Kết quả tìm kiếm:</h1>
                </div>
                <div className='flex space-x-2'>
                    <button className='btn' onClick={() => setSortOption('name')}>Sắp xếp theo chữ cái</button>
                    {currentLocation && Object.keys(distances).length > 0 && (
                        <button className='btn' onClick={() => setSortOption('distance')}>Gần nhất</button>
                    )}
                    <button className='btn' onClick={() => setSortOption('cheapest')}>Giá rẻ nhất</button>
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
                <div className='mt-8 flex flex-row space-x-4'>
                    <div className='w-1/4 p-4 bg-white rounded-lg shadow-md'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-bold'>Bộ lọc</h2>
                            <button 
                                onClick={resetFilters}
                                className='btn btn-sm btn-outline btn-error'
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                        <div className='mb-4'>
                            <label className='block text-sm font-semibold'>Giá tiền mỗi đêm (VND)</label>
                            <input
                                type='range'
                                min='0'
                                max='50000000'
                                value={minPrice}
                                onChange={handleMinPriceChange}
                                className='w-full'
                            />
                            <div className='flex items-center mt-2'>
                                <span className='mr-2'>Tối thiểu:</span>
                                <input
                                    type='text'
                                    value={formatCurrency(minPrice)}
                                    onChange={handleMinPriceChange}
                                    className='w-2/4'
                                />
                            </div>
                            <input
                                type='range'
                                min='0'
                                max='50000000'
                                value={maxPrice}
                                onChange={handleMaxPriceChange}
                                className='w-full mt-4'
                            />
                            <div className='flex items-center mt-2'>
                                <span className='mr-2'>Tối đa:</span>
                                <input
                                    type='text'
                                    value={formatCurrency(maxPrice)}
                                    onChange={handleMaxPriceChange}
                                    className='w-2/4'
                                />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <label className='block text-sm font-semibold'>Đánh giá</label>
                            <div className="rating mt-3">
                                {[...Array(5)].map((_, i) => (
                                    <input
                                        key={i}
                                        type="radio"
                                        name="rating-2"
                                        className="mask mask-star-2 bg-orange-400"
                                        checked={selectedRating === i + 1}
                                        onChange={() => handleRatingChange(i + 1)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className='block text-sm font-semibold'>Tiện nghi</label>
                            <div className='flex flex-col'>
                                <label className='cursor-pointer flex items-center mt-2'>
                                    <input
                                        type='checkbox'
                                        className='checkbox checkbox-primary'
                                        checked={amenities.wifi}
                                        onChange={() => handleAmenityChange('wifi')}
                                    />
                                    <span className='ml-2'>Wifi</span>
                                </label>
                                <label className='cursor-pointer flex items-center mt-2'>
                                    <input
                                        type='checkbox'
                                        className='checkbox checkbox-primary'
                                        checked={amenities.pool}
                                        onChange={() => handleAmenityChange('pool')}
                                    />
                                    <span className='ml-2'>Hồ bơi</span>
                                </label>
                                <label className='cursor-pointer flex items-center mt-2'>
                                    <input
                                        type='checkbox'
                                        className='checkbox checkbox-primary'
                                        checked={amenities.gym}
                                        onChange={() => handleAmenityChange('gym')}
                                    />
                                    <span className='ml-2'>Phòng gym</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='flex-grow flex flex-col space-y-4'>
                        {sortedHotels().map((search: Hotels, index: number) => {
                            const imgUrl = allImg.find((img: Imgs) => img.hotelId === search.id);
                            const availableRooms = allRoom
                                .filter((room: Rooms) => room.hotelId === search.id)
                                .filter((room: Rooms) => {
                                    const availability = allavailable.find((avail: Availabilities) => avail.roomId === room.id);
                                    return availability ? availability.available : false;
                                });

                            const cheapestRoom = availableRooms.reduce((prev: Rooms, curr: Rooms) => {
                                return prev.pricePerNight < curr.pricePerNight ? prev : curr;
                            }, availableRooms[0]);

                            return (
                                distances[search.id] !== null && (
                                    <a href={`/details/` + search.id} key={index} className='block'>
                                        <div className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex hover:bg-gray-100'>
                                            <div className='flex'>
                                                <img 
                                                    src={imgUrl ? `${imgUrl.imageUrl}` : 'Không t���n tại'} 
                                                    alt={imgUrl ? `${imgUrl.imageTitle}` : 'Không tồn tại'}
                                                    width={200}
                                                    height={200}
                                                    className='rounded-lg mr-4'
                                                />
                                                <div className='flex flex-col'>
                                                    <a href={`/details/` + search.id} className='text-xl font-semibold text-sky-500 hover:text-sky-700 transition-colors'>{search.name}</a>
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
                                                    <p className='mt-2 font-bold'>Cơ sở lưu trú này có:</p>
                                                    <div className='flex space-x-2'>
                                                        {search.amenities.wifi && <span className='badge'>Wifi</span>}
                                                        {search.amenities.pool && <span className='badge'>Hồ bơi</span>}
                                                        {search.amenities.gym && <span className='badge'>Phòng gym</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex-none w-1/4 p-4'>
                                                {cheapestRoom ? (
                                                    <div className='bg-gray-100 p-2 rounded-lg'>
                                                        <h2 className='text-lg font-bold'>Phòng rẻ nhất</h2>
                                                        <p>Loại phòng: {cheapestRoom.roomType}</p>
                                                        <p>Giá: {formatCurrency(cheapestRoom.pricePerNight)}</p>
                                                    </div>
                                                ) : (
                                                    <p className='text-red-500'>Không có phòng trống</p>
                                                )}
                                            </div>
                                        </div>
                                    </a>
                                )
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchHotel;