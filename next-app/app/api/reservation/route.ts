import prisma from "@/app/utils/connect";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";
import { io } from 'socket.io-client';

export async function POST(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 })
        }

        const { roomId, FullName, PhoneNumber, Email, DateIn, DateOut } = await req.json();

        if (!roomId || !FullName || !PhoneNumber || !Email || !DateIn || !DateOut) {
            return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin", status: 400 })
        }

        if (PhoneNumber.length != 10) {
            return NextResponse.json({ error: "Số điện thoại 10 số", status: 400 })
        }

        if (FullName.length < 3) {
            return NextResponse.json({ error: "Tên phải từ 3 kí tự trở lên", status: 400 })
        }
        
        const existingReservation = await prisma.reservation.findFirst({
            where: {
                roomId,
                FullName,
                PhoneNumber,
                Email,
                DateIn,
                DateOut,
                userId,
            }
        });

        if (existingReservation) {
            return NextResponse.json({ reservation: existingReservation, status: 200 });
        }

        const reservation = await prisma.reservation.create({
            data: {
                roomId, 
                userId,
                FullName, 
                PhoneNumber, 
                Email, 
                DateIn, 
                DateOut,
            }
        });

        // Emit sự kiện khi có đơn đặt phòng mới
        const socket = io('http://localhost:3001');
        socket.emit('newReservation');
        socket.disconnect();

        return NextResponse.json({ reservation, status: 200 });

    } catch (error) {
        console.log("Lỗi tạo đơn đặt phòng: ", error);
        return NextResponse.json({ error: "Lỗi tạo đơn đặt phòng", status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const search = url.searchParams.get('search') || '';
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '4', 10);
        const skip = (page - 1) * limit;

        const reservation = await prisma.reservation.findMany({
            orderBy: {
                id: 'desc',
            },
            where: {
                OR: [
                    { FullName: { contains: search, mode: 'insensitive' } },
                    { Email: { contains: search, mode: 'insensitive' } },
                    { PhoneNumber: { contains: search, mode: 'insensitive' } },
                ],
                Status: false,
            },
            take: limit,
            skip: skip,
        });

        const total = await prisma.reservation.count({
            where: {
                OR: [
                    { FullName: { contains: search, mode: 'insensitive' } },
                    { Email: { contains: search, mode: 'insensitive' } },
                    { PhoneNumber: { contains: search, mode: 'insensitive' } },
                ],
                Status: false,
            },
        });

        const all = await prisma.reservation.findMany({});

        return NextResponse.json({ reservation, all, total, page, limit, status: 200 });
    } catch (error) {
        console.log("Lỗi lấy đơn đặt phòng: ", error);
        return NextResponse.json({ error: "Lỗi lấy đơn đặt phòng", status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { userId } = auth();
        const { id , Status } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 });
        }

        const update = await prisma.reservation.update({
            where: { id },
            data: {
                Status,
            }
        });
        console.log(update);
        return NextResponse.json({ update, status: 200 });
    } catch (error) {
        console.log("Lỗi xử lý đơn đặt phòng: ", error);
        return NextResponse.json({ error: "Lỗi xử lý đơn đặt phòng", status: 500 });
    }
}



