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

        const room = await prisma.rooms.findUnique({
            where: {
                id,
            },
        });

        if (!room) {
            return NextResponse.json({ error: "Phòng không tồn tại", status: 404 });
        }

        return NextResponse.json({ room, status: 200 });
    } catch (error) {
        console.log("Lỗi lấy phòng: ", error);
        return NextResponse.json({ error: "Lỗi lấy phòng", status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {

        const { userId } = auth();
        const id = params.id;

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 })
        }

        const room = await prisma.rooms.delete({
            where: {
                id,
            },
        })

        return NextResponse.json(room);
    } catch (error) {
        console.log("Lỗi xóa phòng: ", error);
        return NextResponse.json({ error: "Lỗi xóa phòng", status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = auth();
        const { hotelId , roomType, capacityAdults, capacityChildren, pricePerNight } = await req.json();
        const id = params.id;

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 });
        }
        if (!hotelId || !roomType || !capacityAdults || !capacityChildren || !pricePerNight ) {
            return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin", status: 400 })
        }

        if (roomType.length < 3) {
            return NextResponse.json({ error: "Tiêu đề phải dài hơn 3 kí tự", status: 400 })
        }

        const updatedRoom = await prisma.rooms.update({
            where: { id },
            data: {
                hotelId,
                roomType,
                capacityAdults,
                capacityChildren,
                pricePerNight,
            }
        });

        return NextResponse.json({ updatedRoom, status: 200 });
    } catch (error) {
        console.log("Lỗi cập nhật phòng: ", error);
        return NextResponse.json({ error: "Lỗi cập nhật phòng", status: 500 });
    }
}

