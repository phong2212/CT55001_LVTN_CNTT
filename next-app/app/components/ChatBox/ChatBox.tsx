import React, { useState } from 'react'

export const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="chat-button" onClick={toggleChatBox}>
        Chat
      </button>
      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">AI Support</div>
          <div className="chat-body">
          </div>
          <div className="chat-footer">
            <input type="text" placeholder="Nhập để gửi hỗ trợ..." />
            <button>Gửi</button>
          </div>
        </div>
      )}
    </div>
  )
}
