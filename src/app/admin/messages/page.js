'use client';

import { useState, useEffect, useRef } from 'react';
import {
  HiOutlinePaperAirplane,
  HiOutlineEllipsisVertical,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
} from 'react-icons/hi2';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/conversations');
        if (!response.ok) throw new Error('Failed to fetch conversations');
        const data = await response.json();
        setConversations(data);
        if (data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } catch (err) {
        // Mock data
        const mockConversations = [
          {
            id: 1,
            clientName: 'John Smith',
            clientCompany: 'Acme Corp',
            lastMessage: 'Thanks for the proposal. Can we discuss next week?',
            lastMessageTime: '2 hours ago',
            unreadCount: 0,
            avatar: 'JS',
          },
          {
            id: 2,
            clientName: 'Sarah Johnson',
            clientCompany: 'Tech Solutions',
            lastMessage: 'When can we schedule the kick-off meeting?',
            lastMessageTime: '4 hours ago',
            unreadCount: 2,
            avatar: 'SJ',
          },
          {
            id: 3,
            clientName: 'Mike Davis',
            clientCompany: 'StartupXYZ',
            lastMessage: 'Looking forward to working with you!',
            lastMessageTime: '1 day ago',
            unreadCount: 0,
            avatar: 'MD',
          },
          {
            id: 4,
            clientName: 'Emily Chen',
            clientCompany: 'Digital Agency Pro',
            lastMessage: 'Please review the attached documents',
            lastMessageTime: '2 days ago',
            unreadCount: 1,
            avatar: 'EC',
          },
        ];
        setConversations(mockConversations);
        if (mockConversations.length > 0) {
          setSelectedConversation(mockConversations[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `/api/admin/conversations/${selectedConversation.id}/messages`
          );
          if (!response.ok) throw new Error('Failed to fetch messages');
          const data = await response.json();
          setMessages(data);
        } catch (err) {
          // Mock messages
          const mockMessages = [
            {
              id: 1,
              sender: 'client',
              senderName: selectedConversation.clientName,
              content: 'Hi! I wanted to discuss our project proposal.',
              timestamp: '2024-03-20 10:00 AM',
            },
            {
              id: 2,
              sender: 'admin',
              senderName: 'You',
              content: `Great to hear from you! I'm excited to work on this project. What are your main concerns?`,
              timestamp: '2024-03-20 10:15 AM',
            },
            {
              id: 3,
              sender: 'client',
              senderName: selectedConversation.clientName,
              content: 'The timeline and budget are the key factors for us.',
              timestamp: '2024-03-20 10:30 AM',
            },
            {
              id: 4,
              sender: 'admin',
              senderName: 'You',
              content: 'I completely understand. Let me prepare a detailed proposal addressing those points.',
              timestamp: '2024-03-20 10:45 AM',
            },
            {
              id: 5,
              sender: 'client',
              senderName: selectedConversation.clientName,
              content: 'Thanks for the proposal. Can we discuss next week?',
              timestamp: '2024-03-20 2:00 PM',
            },
          ];
          setMessages(mockMessages);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const response = await fetch(
        `/api/admin/conversations/${selectedConversation.id}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      if (!response.ok) throw new Error('Failed to send message');
      const sentMessage = await response.json();
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      // Add message optimistically
      const optimisticMessage = {
        id: Date.now(),
        sender: 'admin',
        senderName: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleString(),
      };
      setMessages([...messages, optimisticMessage]);
      setNewMessage('');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.clientCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Communicate with your clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-96 lg:h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs text-gray-600">Loading...</p>
              </div>
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  style={
                    selectedConversation?.id === conversation.id
                      ? { backgroundColor: '#1e3a5f15' }
                      : {}
                  }
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                        style={{ backgroundColor: '#2d8b7a' }}
                      >
                        {conversation.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.clientName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.clientCompany}
                        </p>
                      </div>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span
                        className="ml-2 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold text-white text-center"
                        style={{ backgroundColor: '#1e3a5f' }}
                      >
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conversation.lastMessageTime}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-sm">No conversations</p>
            </div>
          )}
        </div>

        {/* Messages Panel */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{selectedConversation.clientName}</p>
                  <p className="text-sm text-gray-600">{selectedConversation.clientCompany}</p>
                </div>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                  <HiOutlineEllipsisVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'admin'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                      style={
                        message.sender === 'admin'
                          ? { backgroundColor: '#1e3a5f' }
                          : {}
                      }
                    >
                      <p className="text-sm font-medium mb-1">{message.senderName}</p>
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'admin' ? 'text-blue-200' : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="p-2 rounded-lg text-white transition-colors disabled:opacity-50"
                    style={{ backgroundColor: '#2d8b7a' }}
                    onMouseEnter={(e) =>
                      !sending && (e.currentTarget.style.backgroundColor = '#246d63')
                    }
                    onMouseLeave={(e) =>
                      !sending && (e.currentTarget.style.backgroundColor = '#2d8b7a')
                    }
                  >
                    <HiOutlinePaperAirplane className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
