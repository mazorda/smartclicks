import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare, Clock } from 'lucide-react';

type Message = {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  confidence?: number;
};

type Props = {
  compact?: boolean;
};

export default function ChatBot({ compact = false }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: "MiaAI is coming soon! 🚀\n\nOur Marketing Intelligence Assistant is currently in final testing. She'll be ready to help optimize your campaigns in:\n\n⏰ 90 days",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`flex flex-col ${compact ? 'h-[400px]' : 'h-[calc(100vh-12rem)]'}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-center mb-6">
          <img
            src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150"
            alt="MiaAI"
            className="w-16 h-16 rounded-full border-2 border-blue-200"
          />
        </div>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-4 ${
              msg.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100'
            }`}>
              <p className="whitespace-pre-line">{msg.content}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-xs ${
                  msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            disabled
            placeholder="MiaAI is coming soon..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <button
            disabled
            className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed flex items-center space-x-2"
          >
            <Clock className="h-4 w-4" />
            <span>Coming Soon</span>
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          MiaAI will be available in 90 days
        </p>
      </div>
    </div>
  );
}