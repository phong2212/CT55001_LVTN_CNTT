import { NextResponse } from 'next/server';
import { Server } from 'socket.io';

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = 3001;
io.listen(port);

export async function GET() {
  return NextResponse.json({ message: "WebSocket server is running" });
} 