import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

let conversationHistory: string[] = [];

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Yêu cầu nhập prompt", status: 400 });
        }

        conversationHistory.push(`User: ${prompt}`);

        const hotels = await prisma.hotels.findMany();
        const rooms = await prisma.rooms.findMany();

        const combinedData = hotels.map(hotel => {
            return {
                name: hotel.name,
                location: hotel.location,
                city: hotel.city,
                rating: hotel.rating,
                description: hotel.description,
                amenities: hotel.amenities,
                rooms: rooms.filter(room => room.hotelId === hotel.id).map(room => ({
                    roomType: room.roomType,
                    capacityAdults: room.capacityAdults,    
                    capacityChildren: room.capacityChildren,
                    pricePerNight: room.pricePerNight,
                }))
            };
        });

        const systemInstruction = process.env.SYSTEM_INSTRUCTION || '';
        const combinedPrompt = `${systemInstruction} ${JSON.stringify(combinedData)} ${conversationHistory.join(' ')} ${prompt}`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_PUBLIC_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(combinedPrompt);
        const generatedText = result.response.text();

        conversationHistory.push(`AI: ${generatedText}`);

        return NextResponse.json({ text: generatedText, status: 200 });
    } catch (error) {
        console.error('Lỗi kết nối với Gemini AI:', error);
        return NextResponse.json({ error: "Lỗi khi tạo văn bản", status: 500 });
    }
}


