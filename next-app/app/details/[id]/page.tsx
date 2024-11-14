'use client'
import React, { useState, useEffect } from 'react'
import { useGlobalState } from '@/app/hooks/useGlobalState';
import { address, email, idCard, phone, location, wifi, gym, pool, star, trashcan } from '@/app/utils/Icons';

interface Rooms {
  id: string;
  hotelId: string;
  roomType: string;
  capacityAdults: number;
  capacityChildren: number;
  pricePerNight: number;
  numberOfRooms: number;
  createdAt: string;
  updatedAt: string;
}

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
  createdAt: string;
  updatedAt: string;
}

interface Imgs {
  id: string;
  hotelId: string;
  imageTitle: string;
  imageUrl: string;
}

const DetailsPage = ({ params }: { params: { id: string } }) => {
  const { allRoom, allHotel, allImg, getCoordinates } = useGlobalState();
  const hotel = allHotel.find((hotels: Hotels) => hotels.id === params.id);
  const img = allImg.find((imgs: Imgs) => imgs.hotelId === params.id);
  const rooms = allRoom.filter((rooms: Rooms) => rooms.hotelId === params.id);
  const [isLoading, setIsLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<{ room: Rooms, quantity: number }[]>([]);
  const [roomQuantities, setRoomQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (hotel) {
        const coords = await getCoordinates(hotel.location);
        if (coords) {
          setCoordinates(coords);
        }
      }
    };

    fetchCoordinates();
  }, [hotel]);

  useEffect(() => {
    if (hotel && img) {
      setIsLoading(false);
    }
  }, [hotel, img]);

  const handleSelectRoom = (room: Rooms) => {
    const quantity = roomQuantities[room.id] || 0;
    if (quantity > 0) {
      setSelectedRooms((prevSelectedRooms) => {
        const existingRoom = prevSelectedRooms.find((r) => r.room.id === room.id);
        if (existingRoom) {
          return prevSelectedRooms.map((r) =>
            r.room.id === room.id ? { ...r, quantity } : r
          );
        }
        return [...prevSelectedRooms, { room, quantity }];
      });
    }
  };

  const totalPrice = selectedRooms.reduce((total, { room, quantity }) => total + room.pricePerNight * quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className='h-full caret-transparent'>
      <div className='grid grid-cols-3 gap-12 m-16'>
        <div className='bg-base-200 px-8 py-12 rounded-badge drop-shadow-lg'>
          <div className='sticky top-10 flex flex-row justify-between items-center'>

            {isLoading ? (
              <div>
                <div className='flex flex-row items-center'>
                  <span className='skeleton w-8 h-8 rounded-full shrink-0 mr-5'></span>
                  <h1 className='skeleton h-8 w-52'> </h1>
                </div>
                <div className="skeleton h-52 w-96 mt-6"></div>
                <div className='mt-5'>
                  <div className="skeleton h-7 w-52 mt-4"></div>
                  <div className="skeleton h-7 w-96 mt-4"></div>
                  <div className="skeleton h-7 w-96 mt-4"></div>
                </div>
              </div>

            ) : (

              <div>
                <div className='flex flex-row items-center'>
                  <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{idCard}</span>
                  <h1 className='text-3xl font-bold text-start text-sky-400'>
                    Liên hệ
                  </h1>
                </div>
                <div className='flex flex-col mt-6 '>
                  <div className='flex flex-row items-center'>
                    <span className='text-lg text-bold'>{email}</span>
                    <p className='ml-5 text-md '> {hotel ? hotel.name.replace(/\s+/g, '') : 'Không tồn tại'}@gmail.com</p>
                  </div >
                  <div className='flex flex-row items-center mt-2'>
                    <span className='text-lg text-bold'> {phone}</span>
                    <p className='ml-5 text-md '>+84 999999999</p>
                  </div>

                  <div className='flex flex-row  mt-2'>
                    <span className='text-lg text-bold'>  {address}</span>
                    <p className='ml-5 text-md '>{hotel ? hotel.location : 'Không tồn tại'}</p>
                  </div>
                  <iframe
                    className='rounded-2xl mt-5'
                    src={coordinates ? `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}` : ''}
                    width="365"
                    height="300"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='col-span-2 bg-base-200 px-16 py-12 rounded-badge drop-shadow-lg'>
          <div className='flex flex-row justify-between items-center'>

            {isLoading ? (
              <div>
                <div className='flex flex-row items-center'>
                  <span className='skeleton w-8 h-8 rounded-full shrink-0 mr-5'></span>
                  <h1 className='skeleton h-8 w-52'> </h1>
                </div>
                <div className="skeleton h-52 w-96 mt-6"></div>
                <div className='mt-5'>
                  <div className="skeleton h-7 w-52 mt-4"></div>
                  <div className="skeleton h-7 w-96 mt-4"></div>
                  <div className="skeleton h-7 w-96 mt-4"></div>
                </div>
              </div>
            ) : (
              <div>
                <div className='flex flex-row items-center justify-between'>
                  <div className='flex flex-row items-center'>
                    <span className='btn btn-sm btn-info rounded-full text-white no-animation mr-5 hover:bg-info cursor-default'>{location}</span>
                    <h1 className='text-3xl font-bold text-start text-sky-400'>
                      {hotel ? hotel.name : 'Không tồn tại'}
                    </h1>
                  </div>
                </div>
                <div className='flex justify-center items-center mt-6'>
                  <div className='relative rounded-2xl '>
                    <div className='rounded-2xl overflow-hidden'>
                      <img
                        src={img ? img.imageUrl : ''}
                        alt={img ? img.imageTitle : 'Không tồn tại'}
                        width="650"
                        height="400"
                      />
                    </div>
                    <div className='absolute bottom-0 left-0 bg-black bg-opacity-50 rounded-tr-xl rounded-bl-2xl text-white text-sm py-1 px-2'>
                      {hotel ? `${hotel.location}` : 'Không tồn tại'}
                    </div>
                  </div>
                </div>
                <div className='flex flex-row items-center justify-center mt-8'>
                  <div className='btn btn-outline m-2'>
                    {hotel && hotel.rating ? (
                      Array.from({ length: hotel.rating }, (_, index) => (
                        <span key={index} className='text-yellow-500'>{star}</span>
                      ))
                    ) : ''}
                  </div>
                  {hotel && hotel.amenities.wifi ? <span className='btn btn-outline m-2'>{wifi} Wifi</span> : ''}
                  {hotel && hotel.amenities.gym ? <span className='btn btn-outline m-2'>{gym} Gym</span> : ''}
                  {hotel && hotel.amenities.pool ? <span className='btn btn-outline m-2'>{pool} Bể bơi</span> : ''}
                </div>
                <p className='mt-5 text-justify'>
                  {hotel ? hotel.description : 'Không tồn tại'}
                  <br /> <br /> Khách sạn {hotel ? hotel.name : 'Không tồn tại'} tọa lạc ngay trung tâm thành phố, là điểm đến lý tưởng cho những ai tìm kiếm một không gian nghỉ dưỡng đẳng cấp và hiện đại.
                  Với thiết kế tinh tế kết hợp hài hòa giữa phong cách sang trọng và sự ấm cúng,
                  khách sạn mang lại cảm giác thoải mái và thư giãn tuyệt đối cho du khách.
                  Hệ thống phòng nghỉ được trang bị đầy đủ tiện nghi từ giường ngủ cao cấp,
                  phòng tắm hiện đại, đến các thiết bị thông minh hỗ trợ tối đa nhu cầu sinh hoạt.
                  Đội ngũ nhân viên chuyên nghiệp, tận tâm và luôn sẵn sàng phục vụ 24/7,
                  giúp khách hàng có một kỳ nghỉ trọn vẹn và đáng nhớ. Ngoài ra,
                  khách sạn còn cung cấp nhiều tiện ích đa dạng như
                  {hotel && hotel.amenities.wifi ? ' wifi,' : ''}
                  {hotel && hotel.amenities.gym ? ' gym,' : ''}
                  {hotel && hotel.amenities.pool ? ' bể bơi,' : ''}
                  ... mang đến trải nghiệm đẳng cấp và sự hài lòng tuyệt đối.
                </p>

                <hr className='my-8 border-gray-300' />

                <div className='mt-10'>
                  <h2 className='text-2xl font-bold text-center mb-5'>Danh sách phòng</h2>
                  {rooms.map((room: Rooms) => (
                    <div key={room.id} className='border-t border-gray-300 pt-5 mt-5'>
                      <div className='flex justify-between items-center'>
                        <div>
                          <h3 className='text-xl font-semibold'>{room.roomType}</h3>
                          <p>Sức chứa: {room.capacityAdults} người lớn, {room.capacityChildren} trẻ em</p>
                          <p>Giá mỗi đêm: {formatPrice(room.pricePerNight)}</p>
                          <p>Phòng còn lại: {room.numberOfRooms}</p>
                        </div>
                        <div className='flex flex-col items-center'>
                          <div className='flex items-center mt-2'>
                            <button 
                              className='btn btn-outline btn-sm' 
                              onClick={() => setRoomQuantities({ 
                                ...roomQuantities, 
                                [room.id]: Math.max(0, (roomQuantities[room.id] || 0) - 1) 
                              })}
                            >
                              -
                            </button>
                            <input
                              type='number'
                              min='0'
                              max={room.numberOfRooms}
                              value={roomQuantities[room.id] || 0}
                              onChange={(e) => setRoomQuantities({ 
                                ...roomQuantities, 
                                [room.id]: parseInt(e.target.value) 
                              })}
                              className='input input-bordered input-sm mx-2 w-16 text-center'
                              style={{ MozAppearance: 'textfield' }}
                            />
                            <button 
                              className='btn btn-outline btn-sm' 
                              onClick={() => setRoomQuantities({ 
                                ...roomQuantities, 
                                [room.id]: Math.min(room.numberOfRooms, (roomQuantities[room.id] || 0) + 1) 
                              })}
                            >
                              +
                            </button>
                          </div>
                          <button className='btn btn-primary mt-2' onClick={() => handleSelectRoom(room)}>Chọn phòng</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className='my-8 border-gray-300' />
                <div className='mt-10'>
                  <h2 className='text-2xl font-bold text-center mb-5'>Đặt phòng</h2>
                  {selectedRooms.map(({ room, quantity }) => (
                    <div key={room.id} className='flex justify-between items-center mb-4'>
                      <p>{room.roomType} - Số lượng: {quantity} - Giá: {formatPrice(room.pricePerNight * quantity)}</p>
                      <button 
                        className='btn btn-outline btn-sm btn-error' 
                        onClick={() => setSelectedRooms(selectedRooms.filter(selectedRoom => selectedRoom.room.id !== room.id))}
                      >
                        {trashcan}
                      </button>
                    </div>
                  ))}
                  <div className='flex justify-between items-center'>
                    <p className='font-bold'>Tổng giá: {formatPrice(totalPrice)}</p>
                    <button className='btn btn-success'>Đặt phòng</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div >

      </div >
    </div >
  )
}

export default DetailsPage