import { useGlobalUpdate } from "@/app/context/globalProvider";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SearchBar() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);
    const [pets, setPets] = useState(false);

    const { searchDest } = useGlobalUpdate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: any) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: any) => {
        e.preventDefault();
        if (searchTerm.trim() === '') {
            toast.error('Vui lòng nhập từ khóa tìm kiếm.');
            return;
        }

        const searchElement = document.getElementById('search');
        if (searchElement) {
            searchElement.classList.remove('invisible');
        }
        searchDest(searchTerm);
    };


    return (
        <div className="p-1 bg-accent shadow-md rounded-lg w-full max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit}>
                <div className="flex space-x-1 items-center">
                    {/* Input tìm kiếm */}
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            className='w-full p-3 h-14 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            onChange={handleSearchChange}
                            placeholder="Tìm kiếm khách sạn..."
                        />
                    </div>

                    {/* Chọn ngày */}
                    <div>
                        <input
                            type="date"
                            className="p-3 border h-14 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Chọn số lượng người */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                            className="p-3 h-14 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {adults} Người lớn, {children} Trẻ em, {rooms} Phòng
                        </button>

                        {/* Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
                                {/* Người lớn */}
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

                                {/* Trẻ em */}
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

                                {/* Phòng */}
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

                                {/* Có thú cưng không */}
                                <div className="flex justify-between items-center">
                                    <label>Có thú cưng</label>
                                    <input
                                        type="checkbox"
                                        checked={pets}
                                        onChange={(e) => setPets(e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Nút tìm kiếm */}
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
