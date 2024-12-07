import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/app/utils/connect'

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        })
    }

    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
        const { id, email_addresses, image_url, first_name, last_name, created_at } = evt.data;

        try {
            const newUser = await prisma.users.create({
                data: {
                    clerkId: id,
                    email: email_addresses[0].email_address,
                    photo: image_url,
                    firstName: first_name,
                    lastName: last_name,
                    createdAt: created_at,
                }
            });

            if (newUser) {
                await clerkClient.users.updateUserMetadata(id, {
                    publicMetadata: {
                        userId: newUser.id,
                    },
                });
            }

            return NextResponse.json({ message: " New user created", newUser });

        } catch (error) {
            console.log("Lỗi tạo tài khoản: ", error);
            return NextResponse.json({ error: "Lỗi tạo tài khoản", status: 500 });
        }
    }

    console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
    console.log('Webhook body:', body)

    return new Response('', { status: 200 })
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const search = url.searchParams.get('search') || '';
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '4', 10);
        const skip = (page - 1) * limit;

        const users = await prisma.users.findMany({
            orderBy: {
                id: 'desc',
            },
            where: {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                ],
            },
            take: limit,
            skip: skip,
        });

        const total = await prisma.users.count({
            where: {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                ],
            },
        });
        
        const admin = await prisma.users.findMany({
            select: {
                clerkId: true,
            },
            where: {
                role: 'ADMIN',
            },
        });

        const all = await prisma.users.findMany({});

        return NextResponse.json({  all, admin, users, total, page, limit, status: 200 });
    } catch (error) {
        console.log("Lỗi lấy tài khoản: ", error);
        return NextResponse.json({ error: "Lỗi lấy tài khoản", status: 500 });
    }
}

