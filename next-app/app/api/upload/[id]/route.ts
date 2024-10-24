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

        const img = await prisma.hotelImages.findUnique({
            where: {
                id,
            },
        });

        return NextResponse.json({ img, status: 200 });
    } catch (error) {
        console.log("Lỗi lấy ảnh: ", error);
        return NextResponse.json({ error: "Lỗi lấy ảnh", status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {

        const { userId } = auth();
        const id = params.id;

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 })
        }

        const img = await prisma.hotelImages.delete({
            where: {
                id,
            },
        })

        return NextResponse.json({img, status: 200});
    } catch (error) {
        console.log("Lỗi xóa ảnh: ", error);
        return NextResponse.json({ error: "Lỗi xóa ảnh", status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = auth();
        const {hotelId, imageTitle, imageUrl } = await req.json();
        const id = params.id;

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 });
        }

        if (!hotelId || !imageTitle || !imageUrl) {
            return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin", status: 400 })
        }
        
        if (imageTitle.length < 3) {
            return NextResponse.json({ error: "Tiêu đề phải dài hơn 3 kí tự", status: 400 })
        }

        const updatedImg = await prisma.hotelImages.update({
            where: { id },
            data: {
                hotelId,
                imageTitle,
                imageUrl,
            }
        });

        return NextResponse.json({ updatedImg, status: 200 });
    } catch (error) {
        console.log("Lỗi cập nhật ảnh: ", error);
        return NextResponse.json({ error: "Lỗi cập nhật ảnh", status: 500 });
    }
}

