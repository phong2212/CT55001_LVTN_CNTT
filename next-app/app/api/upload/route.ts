import prisma from "@/app/utils/connect";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 })
        }

        const {hotelId, imageTitle, imageUrl } = await req.json();

        if (!hotelId || !imageTitle || !imageUrl) {
            return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin", status: 400 })
        }
        
        if (imageTitle.length < 3) {
            return NextResponse.json({ error: "Tiêu đề phải dài hơn 3 kí tự", status: 400 })
        }

        const hotelImages = await prisma.hotelImages.create({
            data: {
                hotelId,
                imageTitle,
                imageUrl,
            }
        });


        return NextResponse.json({ hotelImages, status: 200 });

    } catch (error) {
        console.log("Lỗi tạo ảnh khách sạn: ", error);
        return NextResponse.json({ error: "Lỗi tạo ảnh khách sạn", status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const search = url.searchParams.get('search') || '';
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '4', 10);
        const skip = (page - 1) * limit;

        const imgs = await prisma.hotelImages.findMany({
            orderBy: {
                id: 'desc',
            },
            where: {
                OR: [
                    { imageTitle: { contains: search, mode: 'insensitive' } },
                ],
            },
            take: limit,
            skip: skip,
        });

        const all = await prisma.hotelImages.findMany({});

        const total = await prisma.hotelImages.count({});

        return NextResponse.json({ imgs, all, total, page, limit, status: 200 });
    } catch (error) {
        console.log("Lỗi lấy ảnh khách sạn: ", error);
        return NextResponse.json({ error: "Lỗi lấy ảnh khách sạn", status: 500 });
    }
}



