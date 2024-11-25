import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { support } from '@/app/utils/Icons';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const ChatBox = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: Message = { sender: 'ai', text: 'Xin chào! bạn cần hỗ trợ gì không?' };
      setMessages([initialMessage]);
    }
  }, [isOpen]);

  const toggleChatBox = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
        const response = await axios.post('/api/geminiai', { prompt: input });
        const aiResponseText = response.data.text;

        if (!aiResponseText) {
            console.error('AI did not provide a response.');
            setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: 'Xin lỗi, Hiện tại đang có vẫn đề lỗi. ' }]);
        } else {
            console.log('AI Response:', aiResponseText);
            const aiMessage: Message = { sender: 'ai', text: aiResponseText };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }
    } catch (error) {
        console.error('Error fetching AI response:', error);
    } finally {
        setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const { fullName, imageUrl } = user || {
    fullName: "Người dùng ẩn danh",
    imageUrl: "https://cdn3.iconfinder.com/data/icons/avatar-165/536/NORMAL_HAIR-512.png"
  };

  return (
    <div>
      <button 
        className="chat-button flex justify-center items-center text-2xl" 
        onClick={toggleChatBox}
      >
        {support}
      </button>
      {isOpen && (
        <div className="chat-box caret-primary-content bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="chat-header bg-blue-500 text-white p-4">AI Support</div>
          <div className="chat-body p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <img
                    src="/ai-avatar.jpg"
                    alt="AI Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <img
                    src={imageUrl}
                    alt={`Ảnh của ${fullName}`}
                    className="w-8 h-8 rounded-full ml-2"
                  />
                )}
              </div>
            ))}
            {isTyping && <div className="message ai">Đang nhập...</div>}
          </div>
          <div className="chat-footer p-4 flex items-center">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Nhập để gửi hỗ trợ..."
              className="flex-grow border border-gray-300 rounded-lg p-2 mr-2"
            />
            <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
