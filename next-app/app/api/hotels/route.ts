import prisma from "@/app/utils/connect";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 })
        }

        const { name, location, city, rating, description, amenities } = await req.json();

        if (!name || !location || !city || !rating || !description || !amenities) {
            return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin", status: 400 })
        }

        if (name.length < 3) {
            return NextResponse.json({ error: "Tiêu đề phải dài hơn 3 kí tự", status: 400 })
        }

        const hotels = await prisma.hotels.create({
            data: {
                name,
                location,
                city,
                rating,
                description,
                amenities,
            }
        });


        return NextResponse.json({ hotels, status: 200 });

    } catch (error) {
        console.log("Lỗi tạo khách sạn: ", error);
        return NextResponse.json({ error: "Lỗi tạo khách sạn", status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const search = url.searchParams.get('search') || '';
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '4', 10);
        const skip = (page - 1) * limit;

        const hotels = await prisma.hotels.findMany({
            orderBy: {
                id: 'desc',
            },
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { location: { contains: search, mode: 'insensitive' } },
                    { city: { contains: search, mode: 'insensitive' } },
                ],
            },
            take: limit,
            skip: skip,
        });

        const total = await prisma.hotels.count({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { location: { contains: search, mode: 'insensitive' } },
                    { city: { contains: search, mode: 'insensitive' } },
                ],
            },
        });

        const searching = await prisma.hotels.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { location: { contains: search, mode: 'insensitive' } },
                    { city: { contains: search, mode: 'insensitive' } },
                ],
            },
        });

        const all = await prisma.hotels.findMany({});
        const random = await prisma.hotels.findManyRandom(6, {
            select: { id: true, name: true},
            where: {},
        });

        const location = await prisma.hotels.findMany({
            where: {
                OR: [
                    { location: { contains: search, mode: 'insensitive' } },
                    { city: { contains: search, mode: 'insensitive' } },
                ],
            },
        });

        return NextResponse.json({ hotels, all, searching, total, random, location, page, limit, status: 200 });
    } catch (error) {
        console.log("Lỗi lấy khách sạn: ", error);
        return NextResponse.json({ error: "Lỗi lấy khách sạn", status: 500 });
    }
}



