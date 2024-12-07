import prisma from "@/app/utils/connect";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {

        const { userId } = auth();
        const id = params.id;


        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 })
        }

        const reservation = await prisma.reservation.delete({
            where: {
                id,
            },
        })


        return NextResponse.json({ reservation, status: 200 });
    } catch (error) {
        console.log("Lỗi xóa đơn đặt phòng: ", error);
        return NextResponse.json({ error: "Lỗi xóa đơn đặt phòng", status: 500 });
    }
}
