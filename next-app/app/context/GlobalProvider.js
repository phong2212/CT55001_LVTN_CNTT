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
        isLoadingAll: false,
    });
    const [hotels, setHotels] = useState([]);
    const [random, setRandom] = useState([]);
    const [allHotel, setAllHotel] = useState([]);
    const [searchHotels, setSearchHotels] = useState([]);


    const [rooms, setRooms] = useState([]);
    const [allRoom, setAllRoom] = useState([]);
    const [searchRooms, setSearchRooms] = useState([]);

    const [imgs, setImgs] = useState([]);
    const [allImg, setAllImg] = useState([]);

    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPageHotel: 1,
        currentPageRoom: 1,
        currentPageUser: 1,
        currentPageImg: 1,
        totalPagesHotel: 0,
        totalPagesRoom: 0,
        totalPagesUser: 0,
        totalPagesImg: 0,
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
        const hotel = await axios.get(`/api/hotels`);
        setAllHotel(hotel.data.all || []);
        const room = await axios.get(`/api/rooms`);
        setAllRoom(room.data.all || []);
        const img = await axios.get(`/api/upload`);
        setAllImg(img.data.all || []);
    });
    

    const allHotels = async (page = pagination.currentPageHotel, search = searchTerms.searchTermHotel) => 
        handleLoadingState('isLoading', async () => {
            const res = await axios.get(`/api/hotels?page=${page}&limit=4&search=${search}`);
            setHotels(res.data.hotels || []);
            setPagination(prev => ({
                ...prev,
                currentPageHotel: page,
                totalPagesHotel: Math.ceil(res.data.total / 4),
            }));
        });
    
    const randomHotel = async () => 
        handleLoadingState('isLoadingRandom', async () => {
            const res = await axios.get(`/api/hotels`);
            setRandom(res.data.random || []);
        });

    const searchHotel = async (search, adults, children, rooms) => {
        setLoadingStates(prev => ({ ...prev, isLoadingSearch: true }));
        try {
            const res = await axios.get(`/api/hotels?search=${search}`);

            const matchingRooms = allRoom.filter(room => 
                room.capacityAdults == adults && 
                room.capacityChildren == children && 
                room.numberOfRooms >= rooms
            );
            
            const hotelIds = matchingRooms.map((room) => room.hotelId);
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
    
    const deleteHotel = async (id) => {
        await handleLoadingState('isLoading', async () => {
            try {
                const roomsToDelete = allRoom.filter(room => room.hotelId === id);
                await Promise.all(roomsToDelete.map(room => axios.delete(`/api/rooms/${room.id}`)));
                await axios.delete(`/api/hotels/${id}`);
                toast.success("Xóa khách sạn và các phòng liên quan thành công");
                allHotels();
                allRooms();
            } catch (error) {
                toast.error("Có lỗi xảy ra khi xóa khách sạn hoặc phòng");
                console.error("Error deleting hotel or rooms:", error);
            }
        });
    }


    const allRooms = async (page = pagination.currentPageRoom, search = searchTerms.searchTermRoom) => 
        handleLoadingState('isLoading', async () => {
            const res = await axios.get(`/api/rooms?page=${page}&limit=8&search=${search}`);
            setRooms(res.data.rooms || []);
            setPagination(prev => ({
                ...prev,
                currentPageRoom: page,
                totalPagesRoom: Math.ceil(res.data.total / 8),
            }));
        });
    
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
        await handleLoadingState('isLoading', async () => {
            await axios.delete(`/api/rooms/${id}`);
            toast.success("Xóa phòng của khách sạn thành công");
            allRooms();
        });
    }

    const allUsers = async (page = pagination.currentPageUser, search = searchTerms.searchTermUser) => 
        handleLoadingState('isLoading', async () => {
            const res = await axios.get(`/api/webhooks/clerk?page=${page}&limit=4&search=${search}`);
            if (res.data && res.data.total !== undefined) {
                setUsers(res.data.users || []);
                setPagination(prev => ({
                    ...prev,
                    currentPageUser: page,
                    totalPagesUser: Math.ceil(res.data.total / 4),
                }));
            }
        });

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

    const allImgs = async (page = pagination.currentPageImg, search = searchTerms.searchTermImg) => 
        handleLoadingState('isLoading', async () => {
            const res = await axios.get(`/api/upload?page=${page}&limit=4&search=${search}`);
            setImgs(res.data.imgs || []);
            setPagination(prev => ({
                ...prev,
                currentPageImg: page,
                totalPagesImg: Math.ceil(res.data.total / 4),
            }));
        });

    const deleteImg = async (id) => {
        await handleLoadingState('isLoading', async () => {
            await axios.delete(`/api/upload/${id}`);
            toast.success("Xóa ảnh thành công");
            allImgs();
        });
    }
    

    useEffect(() => {
        searchHotel();
        randomHotel();
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

    const contextValue = useMemo(() => ({
        hotels,
        rooms,
        imgs,
        users,
        allHotel,
        allRoom,
        allImg,
        searchHotels,
        searchRooms,
        allHotels,
        allRooms,
        allImgs,
        currentPageHotel: pagination.currentPageHotel,
        currentPageRoom: pagination.currentPageRoom,
        currentPageUser: pagination.currentPageUser,
        currentPageImg: pagination.currentPageImg,
        totalPagesHotel: pagination.totalPagesHotel,
        totalPagesRoom: pagination.totalPagesRoom,
        totalPagesUser: pagination.totalPagesUser,
        totalPagesImg: pagination.totalPagesImg,
        setSearchTermHotel: (term) => setSearchTerms(prev => ({ ...prev, searchTermHotel: term })),
        setSearchTermRoom: (term) => setSearchTerms(prev => ({ ...prev, searchTermRoom: term })),
        setSearchTermUser: (term) => setSearchTerms(prev => ({ ...prev, searchTermUser: term })),
        setSearchTermImg: (term) => setSearchTerms(prev => ({ ...prev, searchTermImg: term })),
        setCurrentPageHotel: (page) => setPagination(prev => ({ ...prev, currentPageHotel: page })),
        setCurrentPageRoom: (page) => setPagination(prev => ({ ...prev, currentPageRoom: page })),
        setCurrentPageUser: (page) => setPagination(prev => ({ ...prev, currentPageUser: page })),
        setCurrentPageImg: (page) => setPagination(prev => ({ ...prev, currentPageImg: page })),
        isLoading: loadingStates.isLoading,
        isLoadingAdmin: loadingStates.isLoadingAdmin,
        isLoadingSearch: loadingStates.isLoadingSearch,
        isLoadingAll: loadingStates.isLoadingAll,
        isLoadingRandom: loadingStates.isLoadingAll,
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
    }), [hotels, rooms, imgs, allHotel, allRoom, allImg, searchHotels, hotelName, searchRooms, users, random, pagination, searchTerms, loadingStates, modal, isAdmin, currentLocation]);

    const updateContextValue = useMemo(() => ({
        allHotels,
        allRooms,
        allUsers,
        searchHotel,
        searchRoom,
    }), [allHotels, allRooms, allUsers, allImgs, searchHotel, searchRoom]);

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

