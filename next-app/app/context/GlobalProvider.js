'use client';

import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useClerk } from '@clerk/nextjs';
import { GlobalContext, GlobalUpdateContext } from './GlobalContext';

export const GlobalProvider = ({ children }) => {
    const { user } = useClerk();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingStates, setLoadingStates] = useState({
        isLoadingAdmin: false,
        isLoading: false,
        isLoadingSearch: false,
        isLoadingRandom: false,
        isLoadingLocation: false,
        isLoadingAll: false,
    });
    const [hotels, setHotels] = useState([]);
    const [random, setRandom] = useState([]);
    const [location, setLocation] = useState([]);
    const [allHotel, setAllHotel] = useState([]);
    const [searchHotels, setSearchHotels] = useState([]);


    const [rooms, setRooms] = useState([]);
    const [allRoom, setAllRoom] = useState([]);
    const [searchRooms, setSearchRooms] = useState([]);

    const [imgs, setImgs] = useState([]);
    const [allImg, setAllImg] = useState([]);

    const [availabilities, setAvailabilities] = useState([]);
    const [allavailable, setAllavailable] = useState([]);
    const [filter, setFilter] = useState('all');

    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPageHotel: 1,
        currentPageRoom: 1,
        currentPageUser: 1,
        currentPageImg: 1,
        currentPageAvailable: 1,
        totalPagesHotel: 0,
        totalPagesRoom: 0,
        totalPagesUser: 0,
        totalPagesImg: 0,
        totalPagesAvailable: 0,
    });
    const [searchTerms, setSearchTerms] = useState({
        searchTermHotel: '',
        searchTermRoom: '',
        searchTermUser: '',
        searchTermImg: '',
    });
    const [modal, setModal] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [searchResult, setSearchResult] = useState(false);
    const [hotelName, setHotelName] = useState([]);
    const [hotelCity, setHotelCity] = useState('');


    const handleLoadingState = async (loadingKey, apiCall) => {
        setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
        try {
            return await apiCall();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    const fetchAdminStatus = async () => {
        if (user) {
            const res = await axios.get(`/api/webhooks/clerk`);
            setIsAdmin(res.data.admin.some(admin => admin.clerkId === user.id));
        }
    };

    useEffect(() => {
        handleLoadingState('isLoadingAdmin', fetchAdminStatus);
    }, [user]);

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);
    const openResult = () => setSearchResult(true);

    const all = async () => handleLoadingState('isLoadingAll', async () => {
        try {
            const hotel = await axios.get(`/api/hotels`);
            setAllHotel(hotel.data.all || []);
            
            const room = await axios.get(`/api/rooms`);
            setAllRoom(room.data.all || []);
            
            const img = await axios.get(`/api/upload`);
            setAllImg(img.data.all || []);
            
            const available = await axios.get(`/api/availability`);
            setAllavailable(available.data.all || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });


    const allHotels = async (page = pagination.currentPageHotel, search = searchTerms.searchTermHotel) => {
        const res = await axios.get(`/api/hotels?page=${page}&limit=4&search=${search}`);
        setHotels(res.data.hotels || []);
        setPagination(prev => ({
            ...prev,
            currentPageHotel: page,
            totalPagesHotel: Math.ceil(res.data.total / 4),
        }));
    };

    const randomHotel = async () =>
        handleLoadingState('isLoadingRandom', async () => {
            const res = await axios.get(`/api/hotels`);
            setRandom(res.data.random || []);
        });

    const locationHotel = async (currentLocation) =>
        handleLoadingState('isLoadingLocation', async () => {
            const res = await axios.get(`/api/hotels?search=${currentLocation}`);
            setLocation(res.data.location || []);
        });

    const searchHotel = async (search, adults, children) => {
        setLoadingStates(prev => ({ ...prev, isLoadingSearch: true }));
        try {
            const res = await axios.get(`/api/hotels?search=${search}`);

            const availableRooms = allRoom.filter(room => {
                const roomAvailability = allavailable.find(avail => avail.roomId === room.id);
                return roomAvailability && roomAvailability.available === true;
            });

            const matchingRooms = availableRooms.filter(room =>
                room.capacityAdults == adults &&
                room.capacityChildren == children
            );

            const hotelIds = matchingRooms.map(room => room.hotelId);
            const matchingHotels = res.data.searching.filter(hotel => hotelIds.includes(hotel.id));
            setSearchHotels(matchingHotels || []);

        } catch (err) {
            console.log(err);
        } finally {
            setLoadingStates(prev => ({ ...prev, isLoadingSearch: false }));
        }
    };

    // const getHotelName  = async (id) => {
    //     setLoadingStates(prev => ({ ...prev, isLoading: true }));
    //     try {
    //         const res = await axios.get(`/api/hotels/${id}`);
    //         setHotel(res.data.hotel || []);
    //     } catch (err) {
    //         console.log(err);
    //     } finally {
    //         setLoadingStates(prev => ({ ...prev, isLoading: false }));
    //     }
    // }

    const getHotelName = async (id) => {
        setLoadingStates(prev => ({ ...prev, isLoading: true }));
        try {
            const res = await axios.get(`/api/hotels/${id}`);
            setHotelName(res.data.hotelName || "");
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingStates(prev => ({ ...prev, isLoading: false }));
        }
    }

    const fetchCityNameFromCurrentLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async ({ coords: { latitude, longitude } }) => {
                    setCurrentLocation({ lat: latitude, lng: longitude });
                    try {
                        const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                        const city = data?.address?.city || 'Không rõ vị trí';
                        setHotelCity(city);
                    } catch (error) {
                        console.error('Error fetching city name:', error);
                        toast.error('Không thể lấy tên thành phố.');
                    }
                },
                () => console.error("Không thể lấy vị trí, hãy cho phép vị trí tại trang web này.")
            );
        } else {
            console.error("Geolocation không hỗ trợ website này.");
        }
    };

    const deleteHotel = async (id) => {
        {
            try {
                const roomsToDelete = allRoom.filter(room => room.hotelId === id);
                for (const room of roomsToDelete) {
                    const Delavails = allavailable.filter(avail => avail.roomId === room.id);
                    await Promise.all(Delavails.map(avail => axios.delete(`/api/availability/${avail.id}`)));
                    await axios.delete(`/api/rooms/${room.id}`);
                }
                await axios.delete(`/api/hotels/${id}`);
                toast.success("Xóa khách sạn và các phòng liên quan thành công");
                allHotels();
                allRooms();
                allAvailabilities();
                all();
            } catch (error) {
                toast.error("Có lỗi xảy ra khi xóa khách sạn hoặc phòng");
                console.error("Error deleting hotel or rooms:", error);
            }
        };
    }


    const allRooms = async (page = pagination.currentPageRoom, search = searchTerms.searchTermRoom) => {
        const res = await axios.get(`/api/rooms?page=${page}&limit=8&search=${search}`);
        setRooms(res.data.rooms || []);
        setPagination(prev => ({
            ...prev,
            currentPageRoom: page,
            totalPagesRoom: Math.ceil(res.data.total / 8),
        }));
    };

    const searchRoom = async (search) => {
        setLoadingStates(prev => ({ ...prev, isLoadingSearch: true }));
        try {
            const res = await axios.get(`/api/rooms?search=${search}`);
            setSearchRooms(res.data.searching || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingStates(prev => ({ ...prev, isLoadingSearch: false }));
        }
    };

    const deleteRoom = async (id) => {
        {
            try {
                const Delavails = allavailable.filter(avail => avail.roomId === id);
                await Promise.all(Delavails.map(avail => axios.delete(`/api/availability/${avail.id}`)));
                await axios.delete(`/api/rooms/${id}`);
                toast.success("Xóa phòng của khách sạn thành công");
                allRooms();
                allAvailabilities();
                all();
            } catch (error) {
                toast.error("Có lỗi xảy ra khi xóa phòng hoặc tình trạng phòng");
                console.error("Error deleting room or availabilities:", error);
            }
        };
    }

    const allUsers = async (page = pagination.currentPageUser, search = searchTerms.searchTermUser) => {
        const res = await axios.get(`/api/webhooks/clerk?page=${page}&limit=4&search=${search}`);
        if (res.data && res.data.total !== undefined) {
            setUsers(res.data.users || []);
            setPagination(prev => ({
                ...prev,
                currentPageUser: page,
                totalPagesUser: Math.ceil(res.data.total / 4),
            }));
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`/api/webhooks/clerk/${id}`);
            toast.success("Xóa tài khoản thành công");
            allUsers();
        } catch (err) {
            console.log(err);
            toast.error("Xóa tài khoản thất bại");
        }
    };

    const allImgs = async (page = pagination.currentPageImg, search = searchTerms.searchTermImg) => {
        const res = await axios.get(`/api/upload?page=${page}&limit=4&search=${search}`);
        setImgs(res.data.imgs || []);
        setPagination(prev => ({
            ...prev,
            currentPageImg: page,
            totalPagesImg: Math.ceil(res.data.total / 4),
        }));
    };

    const deleteImg = async (id) => {
        await axios.delete(`/api/upload/${id}`);
        toast.success("Xóa ảnh thành công");
        allImgs();
    }

    const allAvailabilities = async (page = pagination.currentPageAvailable, filter = 'all') => {
        const res = await axios.get(`/api/availability?page=${page}&limit=6&filter=${filter}`);
        setAvailabilities(res.data.available || []);
        setPagination(prev => ({
            ...prev,
            currentPageAvailable: page,
            totalPagesAvailable: Math.ceil(res.data.total / 6),
        }));
    };

    const updateAvailable = async (available) => {
        try {
            const res = await axios.put(`/api/availability`, available);

            toast.success("Cập nhật tình trạng phòng thành công!");

            allAvailabilities();
            all();
        } catch (err) {
            console.log(err);
            toast.error("Cập nhật tình trạng phòng thất bại");
        }
    }

    const getCoordinates = async (address) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: { q: address, format: 'json', addressdetails: 1, limit: 1 },
            });

            if (response.data?.length) {
                const { lat, lon } = response.data[0];
                return { lat: parseFloat(lat), lng: parseFloat(lon) };
            }
            console.error('No coordinates found for the address');
            return null;
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            return null;
        }
    };

    const getDistance = async (origin, destination) => {
        try {
            const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`, {
                params: { overview: 'false', steps: false },
            });
            if (response.data.routes?.length) {
                return response.data.routes[0].distance / 1000;
            }
            console.error('No routes found');
            return null;
        } catch (error) {
            console.error('Error fetching distance:', error);
            return null;
        }
    };

    // const toRadians = (degrees) => {
    //     return degrees * (Math.PI / 180);
    // };

    // const getDistance2 = (origin, destination) => {
    //     const R = 6371;
    //     const lat1 = toRadians(origin.lat);
    //     const lon1 = toRadians(origin.lng);
    //     const lat2 = toRadians(destination.lat);
    //     const lon2 = toRadians(destination.lng);

    //     const dLat = lat2 - lat1;
    //     const dLon = lon2 - lon1;

    //     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //               Math.cos(lat1) * Math.cos(lat2) *
    //               Math.sin(dLon / 2) * Math.sin(dLon / 2);

    //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    //     const distance = R * c;
    //     return distance;
    // };

    // const origin = { lat: 10.059237, lng: 105.769358 };
    // const destination = { lat: 10.0324785, lng: 105.7849747 };

    // console.log(`Khoảng cách: ${getDistance2(origin, destination)} km`);

    useEffect(() => {
        searchHotel();
        randomHotel();
        fetchCityNameFromCurrentLocation();
        all();
    }, []);

    useEffect(() => {
        allHotels();
    }, [pagination.currentPageHotel, searchTerms.searchTermHotel]);
    useEffect(() => {
        allRooms();
    }, [pagination.currentPageRoom, searchTerms.searchTermRoom]);

    useEffect(() => {
        allUsers();
    }, [pagination.currentPageUser, searchTerms.searchTermUser]);

    useEffect(() => {
        allImgs();
    }, [pagination.currentPageImg, searchTerms.searchTermImg]);

    useEffect(() => {
        allAvailabilities();
    }, [pagination.currentPageAvailable]);

    const contextValue = useMemo(() => ({
        hotels,
        rooms,
        imgs,
        users,
        availabilities,
        all,
        allHotel,
        allRoom,
        allImg,
        allavailable,
        searchHotels,
        searchRooms,
        allHotels,
        allRooms,
        allImgs,
        allAvailabilities,
        currentPageHotel: pagination.currentPageHotel,
        currentPageRoom: pagination.currentPageRoom,
        currentPageUser: pagination.currentPageUser,
        currentPageImg: pagination.currentPageImg,
        currentPageAvailable: pagination.currentPageAvailable,
        totalPagesHotel: pagination.totalPagesHotel,
        totalPagesRoom: pagination.totalPagesRoom,
        totalPagesUser: pagination.totalPagesUser,
        totalPagesImg: pagination.totalPagesImg,
        totalPagesAvailable: pagination.totalPagesAvailable,
        setSearchTermHotel: (term) => setSearchTerms(prev => ({ ...prev, searchTermHotel: term })),
        setSearchTermRoom: (term) => setSearchTerms(prev => ({ ...prev, searchTermRoom: term })),
        setSearchTermUser: (term) => setSearchTerms(prev => ({ ...prev, searchTermUser: term })),
        setSearchTermImg: (term) => setSearchTerms(prev => ({ ...prev, searchTermImg: term })),
        setCurrentPageHotel: (page) => setPagination(prev => ({ ...prev, currentPageHotel: page })),
        setCurrentPageRoom: (page) => setPagination(prev => ({ ...prev, currentPageRoom: page })),
        setCurrentPageUser: (page) => setPagination(prev => ({ ...prev, currentPageUser: page })),
        setCurrentPageImg: (page) => setPagination(prev => ({ ...prev, currentPageImg: page })),
        setCurrentPageAvailable: (page) => setPagination(prev => ({ ...prev, currentPageAvailable: page })),
        isLoading: loadingStates.isLoading,
        isLoadingAdmin: loadingStates.isLoadingAdmin,
        isLoadingSearch: loadingStates.isLoadingSearch,
        isLoadingAll: loadingStates.isLoadingAll,
        isLoadingRandom: loadingStates.isLoadingRandom,
        isLoadingLocation: loadingStates.isLoadingLocation,
        deleteHotel,
        deleteRoom,
        deleteUser,
        deleteImg,
        modal,
        openModal,
        closeModal,
        searchResult,
        openResult,
        isAdmin,
        currentLocation,
        setCurrentLocation,
        getHotelName,
        hotelName,
        random,
        location,
        fetchCityNameFromCurrentLocation,
        hotelCity,
        locationHotel,
        getCoordinates,
        getDistance,
        updateAvailable,
        filter,
        setFilter,
    }), [hotels, rooms, imgs, availabilities, allHotel, allRoom, allImg, allavailable, searchHotels, hotelName, hotelCity, searchRooms, users, random, location, pagination, searchTerms, loadingStates, modal, isAdmin, currentLocation]);

    const updateContextValue = useMemo(() => ({
        allHotels,
        allRooms,
        allUsers,
        allAvailabilities,
        searchHotel,
        searchRoom,
    }), [allHotels, allRooms, allUsers, allAvailabilities, allImgs, searchHotel, searchRoom]);

    return (
        <GlobalContext.Provider value={contextValue}>
            <GlobalUpdateContext.Provider value={updateContextValue}>
                {children}
            </GlobalUpdateContext.Provider>
        </GlobalContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);

