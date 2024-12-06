import { user, hotel, room, image, status, gear } from './Icons';

const menu = [
    {
        id: 1,
        title: 'Tài khoản',
        icon: user,
        link: '/manager',
    },
    {
        id: 2,
        title: 'Khách sạn',
        icon: hotel,
        link: '/manager/hotels',
    },
    {
        id: 3,
        title: 'Phòng',
        icon: room,
        link: '/manager/rooms',
    },
    {
        id: 4,
        title: 'Ảnh khách sạn',
        icon: image,
        link: '/manager/hotelImgs',
    },
    {
        id: 5,
        title: 'Tình trạng phòng',
        icon: status,
        link: '/manager/availabilities',
    },
    {
        id: 6,
        title: 'Xử lí đặt phòng',
        icon: gear,
        link: '/manager/reservation',
    },
];

export default menu;