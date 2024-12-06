import prisma from "@/app/utils/connect";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = auth();
        const id = params.id;

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 })
        }

        const hotel = await prisma.hotels.findUnique({
            where: {
                id,
            },
        });

        const hotelName = await prisma.hotels.findUnique({
            where: {
                id,
            },
            select: { name: true },
        });


        if (!hotel || !hotelName) {
            return NextResponse.json({ error: "Khách sạn không tồn tại", status: 404 });
        }

        return NextResponse.json({ hotel, hotelName, status: 200 });
    } catch (error) {
        console.log("Lỗi lấy khách sạn: ", error);
        return NextResponse.json({ error: "Lỗi lấy khách sạn", status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {

        const { userId } = auth();
        const id = params.id;


        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 })
        }

        const hotel = await prisma.hotels.delete({
            where: {
                id,
            },
        })


        return NextResponse.json({ hotel, status: 200 });
    } catch (error) {
        console.log("Lỗi xóa khách sạn: ", error);
        return NextResponse.json({ error: "Lỗi xóa khách sạn", status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = auth();
        const { name, location, city, rating, description, amenities } = await req.json();
        const id = params.id;

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 });
        }

        if (!name || !location || !city || !rating || !description || !amenities) {
            return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin", status: 400 })
        }

        if (name.length < 3) {
            return NextResponse.json({ error: "Tiêu đề phải dài hơn 3 kí tự", status: 400 })
        }

        const updatedHotel = await prisma.hotels.update({
            where: { id },
            data: {
                name,
                location,
                city,
                rating,
                description,
                amenities,
            }
        });

        return NextResponse.json({ updatedHotel, status: 200 });
    } catch (error) {
        console.log("Lỗi cập nhật khách sạn: ", error);
        return NextResponse.json({ error: "Lỗi cập nhật khách sạn", status: 500 });
    }
}

