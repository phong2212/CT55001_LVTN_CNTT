import { user, hotel, room, image } from './Icons';

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
];

export default menu;