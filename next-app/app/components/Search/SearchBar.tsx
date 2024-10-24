import { useGlobalUpdate } from "@/app/hooks/useGlobalUpdate";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useGlobalState } from "@/app/hooks/useGlobalState";

const GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/reverse';

export default function SearchBar() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);
    const { searchHotel } = useGlobalUpdate();
    const [searchTerm, setSearchTerm] = useState('');
    const { currentLocation, setCurrentLocation, openResult, allRoom, allHotel } = useGlobalState();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => setCurrentLocation({ lat: latitude, lng: longitude }),
                (error) => toast.error("Không thể lấy vị trí, hãy cho phép vị trí tại trang web này.")
            );
        } else {
            toast.error("Geolocation không hợp trở website này.");
        }
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

    const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTerm.trim() === '') {
            toast.error('Hãy điền từ khóa.');
            return;
        }
        try {
            searchHotel(searchTerm, adults, children, rooms);
        } catch (err) {
            console.log(err);
            toast.error('Có lỗi xảy ra khi tìm kiếm.');
        }
        openResult();
    };

    const handleCurrentLocation = async () => {
        if (currentLocation) {
            const { lat, lng } = currentLocation;
            try {
                const { data } = await axios.get(`${GEOCODING_API_URL}?lat=${lat}&lon=${lng}&format=json`);
                const city = data?.address?.city || data?.address?.town || data?.address?.village || 'Không rõ vị trí';
                setSearchTerm(city);
            } catch {
                toast.error('Không thể lấy tên thành phố.');
            }
        } else {
            toast.error('không thể lấy vị trí hiện tại.');
        }
    };

    return (
        <div className="p-1 bg-accent shadow-md rounded-lg w-full max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit}>
                <div className="flex space-x-1 items-center">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            className='w-full p-3 h-14 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            onChange={handleSearchChange}
                            placeholder="Tìm kiếm khách sạn..."
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleCurrentLocation}
                        className="p-3 h-14 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Vị trí hiện tại
                    </button>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                            className="p-3 h-14 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {adults} Người lớn, {children} Trẻ em, {rooms} Phòng
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
                                <div className="flex justify-between items-center mb-2">
                                    <label>Người lớn</label>
                                    <input
                                        type="number"
                                        value={adults}
                                        onChange={(e) => setAdults(Number(e.target.value))}
                                        className="w-16 p-2 border border-gray-300 rounded-md"
                                        min="1"
                                    />
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <label>Trẻ em</label>
                                    <input
                                        type="number"
                                        value={children}
                                        onChange={(e) => setChildren(Number(e.target.value))}
                                        className="w-16 p-2 border border-gray-300 rounded-md"
                                        min="0"
                                    />
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <label>Số phòng</label>
                                    <input
                                        type="number"
                                        value={rooms}
                                        onChange={(e) => setRooms(Number(e.target.value))}
                                        className="w-16 p-2 border border-gray-300 rounded-md"
                                        min="1"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <button className="btn btn-primary px-6 py-3 text-white rounded-lg h-14 shadow focus:outline-none">
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}