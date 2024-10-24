import prisma from "@/app/utils/connect";
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = auth();
        const id = params.id;

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 })
        }

        const user = await prisma.users.findUnique({
            where: {
                clerkId: id,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Tài khoản không tồn tại", status: 404 });
        }

        return NextResponse.json({ user, status: 200 });
    } catch (error) {
        console.log("Lỗi lấy tài khoản: ", error);
        return NextResponse.json({ error: "Lỗi lấy tài khoản", status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {

        const { userId } = auth();
        const id = params.id;

        if (!userId) {
            return NextResponse.json({ error: "Không có quyền truy cập", status: 401 })
        }

        const clerk = await clerkClient.users.deleteUser(id);
        const user = await prisma.users.delete({
            where: {
                clerkId: id,
            },
        })

        return NextResponse.json(user);
    } catch (error) {
        console.log("Lỗi xóa tài khoản: ", error);
        return NextResponse.json({ error: "Lỗi xóa tài khoản", status: 500 });
    }
}


