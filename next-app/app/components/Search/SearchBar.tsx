import { useGlobalUpdate } from "@/app/hooks/useGlobalUpdate";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGlobalState } from "@/app/hooks/useGlobalState";

export default function SearchBar() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const { searchHotel } = useGlobalUpdate();
    const [searchTerm, setSearchTerm] = useState('');
    const { openResult, hotelCity } = useGlobalState();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

    const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTerm.trim() === '') {
            toast.error('Hãy điền từ khóa.');
            return;
        }
        try {
            searchHotel(searchTerm, adults, children);
        } catch (err) {
            console.log(err);
            toast.error('Có lỗi xảy ra khi tìm kiếm.');
        }
        openResult();
    };

   const handleCurrentLocation = () => {
    if (!hotelCity) {
        toast.error("Không có thông tin vị trí hiện tại!");
    } else {
        setSearchTerm(hotelCity);
    }
};

    return (
        <div className="p-4 bg-white shadow-md rounded-lg w-full max-w-3xl mx-auto z-10">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        className='flex-1 p-3 h-14 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={handleSearchChange}
                        placeholder="Tìm kiếm khách sạn..."
                    />
                    <button className="btn btn-primary px-6 py-3 text-white rounded-lg h-14 shadow focus:outline-none ml-2 bg-blue-600 hover:bg-blue-700">
                        Tìm kiếm
                    </button>
                </div>

                <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={handleCurrentLocation}
                            className="p-3 h-14 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600"
                        >
                            Vị trí hiện tại
                        </button>
                    </div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                            className="p-3 h-14 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {adults} Người lớn, {children} Trẻ em
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
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}