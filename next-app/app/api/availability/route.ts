import prisma from "@/app/utils/connect";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '6', 10);
        const skip = (page - 1) * limit;
        const filter = url.searchParams.get('filter') || 'all';

        const whereClause = filter === 'all' ? {} : { available: filter === 'true' };

        const available = await prisma.availability.findMany({
            where: whereClause,
            orderBy: {
                id: 'desc',
            },
            take: limit,
            skip: skip,
        });

        const total = await prisma.availability.count({
            where: whereClause,
        });

        const all = await prisma.availability.findMany({});
        
        return NextResponse.json({ all, available, total,  status: 200 });
    } catch (error) {
        console.log("Lỗi lấy tình trạng phòng: ", error);
        return NextResponse.json({ error: "Lỗi lấy tình trạng phòng", status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { userId } = auth();
        const { id , available } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 });
        }

        const avaiable = await prisma.availability.update({
            where: { id },
            data: {
                available,
            }
        });

        return NextResponse.json({ avaiable, status: 200 });
    } catch (error) {
        console.log("Lỗi cập nhật tình trạng phòng: ", error);
        return NextResponse.json({ error: "Lỗi cập nhật tình trạng phòng", status: 500 });
    }
}



