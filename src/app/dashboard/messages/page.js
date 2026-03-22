'use client';

import { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane, HiEllipsisHorizontal } from 'react-icons/hi2';

export default function Messages() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'admin',
      senderName: 'Sarah Johnson',
      content:
        'Hi! I wanted to follow up on your consulting agreement. Have you had a chance to review it?',
      timestamp: '2024-03-20 10:30 AM',
      read: true,
    },
    {
      id: 2,
      sender: 'client',
      senderName: 'You',
      content:
        'Yes, I reviewed it. Everything looks good. I have a question about the payment schedule though.',
      timestamp: '2024-03-20 11:15 AM',
      read: true,
    },
    {
      id: 3,
      sender: 'admin',
      senderName: 'Sarah Johnson',
      content:
        'Great! The payment schedule is flexible. We can work with monthly or quarterly payments based on your preference. Which would work better for you?',
      timestamp: '2024-03-20 11:45 AM',
      read: true,
    },
    {
      id: 4,
      sender: 'client',
      senderName: 'You',
      content: 'Monthly payments would be ideal for our accounting department.',
      timestamp: '2024-03-20 2:00 PM',
      read: true,
    },
    {
      id: 5,
      sender: 'admin',
      senderName: 'Sarah Johnson',
      content:
        'Perfect! I\'ve updated the agreement with monthly payment terms. It\'s ready for your signature whenever you\'re ready.',
      timestamp: '2024-03-20 2:30 PM',
      read: false,
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'client',
        senderName: 'You',
        content: inputValue,
        timestamp: new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        read: true,
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const unreadCount = messages.filter((m) => !m.read && m.sender === 'admin').length;

  return (
    <div className="space-y-6 h-full">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">
          Communicate with your consulting team
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-lg shadow flex flex-col h-96 lg:h-[500px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Consulting Team
            </h2>
            <p className="text-sm text-gray-600">Active now</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <HiEllipsisHorizontal className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'client' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md ${
                  message.sender === 'client'
                    ? 'bg-blue-600 text-white rounded-bl-lg rounded-tl-lg rounded-tr-lg'
                    : 'bg-gray-100 text-gray-900 rounded-br-lg rounded-tr-lg rounded-tl-lg'
                }`}
              >
                {message.sender === 'admin' && (
                  <p className="text-xs font-semibold opacity-70 px-4 pt-3">
                    {message.senderName}
                  </p>
                )}
                <p className="px-4 py-3 break-words">{message.content}</p>
                <p
                  className={`text-xs px-4 pb-2 ${
                    message.sender === 'client'
                      ? 'text-blue-100'
                      : 'text-gray-500'
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          {unreadCount > 0 && (
            <div className="flex justify-center">
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex gap-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="2"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 h-fit"
            >
              <HiPaperAirplane className="w-4 h-4" />
              <span className="hidden lg:inline">Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Message Guidelines
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              For urgent matters, please call your consulting team directly.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Messages are monitored during business hours (9 AM - 6 PM ET).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Expect a response within 24 hours during business days.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Please do not share sensitive financial information in messages.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
