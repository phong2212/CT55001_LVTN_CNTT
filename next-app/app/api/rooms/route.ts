import prisma from "@/app/utils/connect";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 })
        }

        const { hotelId , roomType, capacityAdults, capacityChildren, pricePerNight, numberOfRooms } = await req.json();

        if (!hotelId || !roomType || !capacityAdults || !pricePerNight || !numberOfRooms) {
            return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin", status: 400 })
        }

        if (roomType.length < 3) {
            return NextResponse.json({ error: "Loại phòng phải dài hơn 3 kí tự", status: 400 })
        }

        const rooms = await prisma.rooms.create({
            data: {
                hotelId,
                roomType,
                capacityAdults,
                capacityChildren,
                pricePerNight,
                numberOfRooms,
            }
        });


        return NextResponse.json({ rooms, status: 200 });

    } catch (error) {
        console.log("Lỗi tạo phòng: ", error);
        return NextResponse.json({ error: "Lỗi tạo phòng", status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const search = url.searchParams.get('search') || '';
        const capacityAdults = parseInt(url.searchParams.get('capacityAdults') || '', 10) || undefined;
        const capacityChildren = parseInt(url.searchParams.get('capacityChildren') || '', 10) || undefined;
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '8', 10);
        const skip = (page - 1) * limit;

        const rooms = await prisma.rooms.findMany({
            orderBy: {
                id: 'desc',
            },
            where: {
                OR: [
                    { roomType: { contains: search, mode: 'insensitive' } },
                    { capacityAdults: { equals: capacityAdults  } },
                    { capacityChildren: { equals: capacityChildren  } },
                ],
            },
            take: limit,
            skip: skip,
        });

        const total = await prisma.rooms.count({
            where: {
                OR: [
                    { roomType: { contains: search, mode: 'insensitive' } },
                    { capacityAdults: { equals: capacityAdults  } },
                    { capacityChildren: { equals: capacityChildren  } },
                ],
            },
        });

        const searching = await prisma.rooms.findMany({
            where: {
                OR: [
                    { roomType: { contains: search, mode: 'insensitive' } },
                    { capacityAdults: { equals: capacityAdults  } },
                    { capacityChildren: { equals: capacityChildren  } },
                ],
            },
        });

        const all = await prisma.rooms.findMany({});

        return NextResponse.json({ rooms, all, searching, total, page, limit, status: 200 });
    } catch (error) {
        console.log("Lỗi lấy phòng: ", error);
        return NextResponse.json({ error: "Lỗi lấy phòng", status: 500 });
    }
}



